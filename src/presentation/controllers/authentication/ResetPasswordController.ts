import {
  CodeMismatchException,
  ConfirmForgotPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import { cognitoClient } from '../../../infra/libs/cognitoClient';
import { badRequest, ok, serverError } from '../../helpers/httpHelpers';
import { IController } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';

class ResetPasswordController implements IController {
  constructor() {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'code', 'newPassword'];
      for await (const field of requiredFields)
        if (!httpRequest.body[field]) return badRequest({ error: `${field} is required.` });

      const command = new ConfirmForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: httpRequest.body.email,
        ConfirmationCode: httpRequest.body.code,
        Password: httpRequest.body.newPassword,
      });

      const { $metadata } = await cognitoClient.send(command);

      return ok({
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

export const resetPasswordController = new ResetPasswordController();
