import { CodeMismatchException, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { IEncrypter } from "../../../domain/use-cases/cryptography/encrypter";
import { IFindUserByEmail } from "../../../domain/use-cases/user/find-user-by-email";
import { JwtAdapter } from "../../../infra/cryptography/JwtAdapter";
import { DbFindUserByEmail } from "../../../infra/database/repositories/user/DbFindUserByEmail";
import { cognitoClient } from "../../../infra/libs/cognitoClient";
import { EmailValidatorAdapter } from "../../../main/adapters/EmailValidatorAdapter";
import { badRequest, notFound, ok, serverError } from "../../helpers/httpHelpers";
import { IController } from "../../protocols/controller";
import { IEmailValidator } from "../../protocols/emailValidator";
import { HttpRequest, HttpResponse } from "../../protocols/http";

class ConfirmAccountEmailController implements IController {
  constructor(
    private readonly emailValidador: IEmailValidator,
    private readonly findUserByEmail: IFindUserByEmail,
    private readonly encrypter: IEncrypter,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'code'];
      for await (const field of requiredFields)
        if (!httpRequest.body[field]) return badRequest({ error: `${field} is required.` });

      const { email, code } = httpRequest.body;

      const isValidEmail = this.emailValidador.isValid(email)
      if (!isValidEmail) return badRequest({ error: 'Invalid e-mail.' });

      const user = await this.findUserByEmail.findByEmail(email);
      if (!user) return notFound({ error: 'user not found.' })

      const command = new ConfirmSignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
      });

      const { $metadata } = await cognitoClient.send(command);
      const accessToken = this.encrypter.encrypt(user.id);

      return ok({
        accessToken,
        userConfirmed: true,
        $metadata,
      });
    } catch (err) {
      const error = err as Error;
      console.log({
        errorName: error.name,
        message: error.message,
      });

      if (error instanceof CodeMismatchException) {
        return badRequest({ error: 'Invalid code.' });
      }

      return serverError();
    }
  }
}

const emailValidator = new EmailValidatorAdapter();
const dbFindUserByEmail = new DbFindUserByEmail();
const jwtAdapter = new JwtAdapter();

export const confirmAccountEmailController = new ConfirmAccountEmailController(emailValidator, dbFindUserByEmail, jwtAdapter);
