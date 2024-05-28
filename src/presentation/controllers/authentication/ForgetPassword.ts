import { ForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';

import { cognitoClient } from '../../../infra/libs/cognitoClient';
import { badRequest, ok, serverError } from '../../helpers/http-helpers';
import { IController } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';

class ForgetPasswordController implements IController {
  constructor() {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email'];
      for await (const field of requiredFields)
        if (!httpRequest.body[field]) return badRequest({ error: `${field} is required.` });

      const command = new ForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: httpRequest.body.email,
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

      return serverError();
    }
  }
}

export const forgetPasswordController = new ForgetPasswordController();
