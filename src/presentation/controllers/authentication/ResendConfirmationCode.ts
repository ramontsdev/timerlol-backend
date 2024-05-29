import { ResendConfirmationCodeCommand } from '@aws-sdk/client-cognito-identity-provider';

import { cognitoClient } from '../../../infra/libs/cognitoClient';
import { badRequest, ok, serverError } from '../../helpers/httpHelpers';
import { IController } from '../../protocols/controller';
import { HttpRequest, HttpResponse } from '../../protocols/http';

class ResendConfirmationCodeController implements IController {
  constructor() {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email'];
      for await (const field of requiredFields)
        if (!httpRequest.body[field]) return badRequest({ error: `${field} is required.` });

      const resendConfirmationCodeCommand = new ResendConfirmationCodeCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: httpRequest.body.email,
      });

      const { $metadata } = await cognitoClient.send(resendConfirmationCodeCommand);

      return ok({ $metadata });
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

export const resendConfirmationCodeController = new ResendConfirmationCodeController();
