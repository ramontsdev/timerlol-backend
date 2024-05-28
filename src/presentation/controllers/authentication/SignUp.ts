import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { ICreateUser } from "../../../domain/use-cases/user/create-user";
import { IFindUserByEmail } from "../../../domain/use-cases/user/find-user-by-email";
import { DbCreateUser } from "../../../infra/database/repositories/user/db-create-user";
import { DbFindUserByEmail } from "../../../infra/database/repositories/user/db-find-user-by-email";
import { cognitoClient } from "../../../infra/libs/cognitoClient";
import { EmailValidatorAdapter } from "../../../main/adapters/email-validator-adapter";
import { badRequest, conflict, created, serverError } from "../../helpers/http-helpers";
import { IController } from "../../protocols/controller";
import { IEmailValidator } from "../../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../../protocols/http";

class SignUpController implements IController {
  constructor(
    private readonly emailValidador: IEmailValidator,
    private readonly findUserByEmail: IFindUserByEmail,
    private readonly createUser: ICreateUser,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'confirmPassword'];
      for await (const field of requiredFields)
        if (!httpRequest.body[field]) return badRequest({ error: `${field} is required.` });

      const { name, email, password, confirmPassword } = httpRequest.body;

      const isValidEmail = this.emailValidador.isValid(email);
      if (!isValidEmail) return badRequest({ error: 'Invalid e-mail.' });

      if (password !== confirmPassword) return badRequest({ error: 'Passwords do not match' });

      const user = await this.findUserByEmail.findByEmail(email);
      if (user) return conflict({ error: 'E-mail already exists' });

      await this.createUser.create({ name, email });

      const signUpCommand = new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [{ Name: 'name', Value: name }],
      });

      const { UserSub, UserConfirmed } = await cognitoClient.send(signUpCommand);

      return created({ userConfirmed: UserConfirmed, awsUserSub: UserSub });
    } catch (err) {
      const error = err as Error;
      console.log({
        errorName: error.name,
        message: error.message,
      });

      return serverError();
    }
  }
}

const emailValidator = new EmailValidatorAdapter();
const dbFindUserByEmail = new DbFindUserByEmail();
const dbCreateUser = new DbCreateUser();

export const signUpController = new SignUpController(emailValidator, dbFindUserByEmail, dbCreateUser);
