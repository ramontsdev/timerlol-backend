import {
  InitiateAuthCommand,
  NotAuthorizedException,
  UserNotConfirmedException
} from '@aws-sdk/client-cognito-identity-provider';

import { UserModel } from '../../../domain/models/user';
import { IEncrypter } from '../../../domain/use-cases/cryptography/encrypter';
import { IFindUserByEmail } from '../../../domain/use-cases/user/find-user-by-email';
import { JwtAdapter } from '../../../infra/cryptography/JwtAdapter';
import { DbFindUserByEmail } from '../../../infra/database/repositories/user/DbFindUserByEmail';
import { cognitoClient } from '../../../infra/libs/cognitoClient';
import { EmailValidatorAdapter } from '../../../main/adapters/EmailValidatorAdapter';
import { badRequest, notFound, ok, serverError, unauthorized } from '../../helpers/httpHelpers';
import { IController } from '../../protocols/controller';
import { IEmailValidator } from '../../protocols/emailValidator';
import { HttpRequest, HttpResponse } from '../../protocols/http';

class SignInController implements IController {
  constructor(
    private readonly emailValidador: IEmailValidator,
    private readonly findUserByEmail: IFindUserByEmail,
    private readonly encrypter: IEncrypter,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];
      for await (const field of requiredFields)
        if (!httpRequest.body[field]) return badRequest({ error: `${field} is required.` });

      const { email, password } = httpRequest.body;

      const isValidEmail = this.emailValidador.isValid(email);
      if (!isValidEmail) return badRequest({ error: 'Invalid e-mail.' });

      const user = await this.findUserByEmail.findByEmail(email);
      if (!user) return notFound({ error: 'E-mail not found.' });

      const { accessToken, userConfirmed } = await this.awsSignIn(user, password);
      /*       if (!userConfirmed) {
              return forbidden({ error: 'Confirmation e-mail is required' })
            } */

      return ok({
        accessToken,
        userConfirmed,
      });
    } catch (err) {
      const error = err as Error;
      console.log({
        errorName: error.name,
        message: error.message,
      });

      if (error instanceof NotAuthorizedException) {
        return unauthorized({ error: error.message });
      }

      return serverError(err);
    }
  }

  private async awsSignIn(user: UserModel, password: string) {
    try {
      const command = new InitiateAuthCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: user.email,
          PASSWORD: password,
        },
      });

      await cognitoClient.send(command);
      const accessToken = this.encrypter.encrypt(user.id);

      return {
        accessToken,
        userConfirmed: true,
      }
    } catch (err) {
      const error = err as Error;
      if (error instanceof UserNotConfirmedException) {

        return {
          userConfirmed: false,
        };
      }

      throw error;
    }
  }
}

const emailValidator = new EmailValidatorAdapter();
const dbFindUserByEmail = new DbFindUserByEmail();
const jwtAdapter = new JwtAdapter();

export const signInController = new SignInController(emailValidator, dbFindUserByEmail, jwtAdapter);
