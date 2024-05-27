import {
  InvalidParameterException,
  SignUpCommand,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import { cognitoClient } from '@/libs/cognitoClient';
import { bodyParser } from '@/utils/bodyParser';
import { response } from '@/utils/response';
import { InvalidParamError } from '@/validations/errors/InvalidParamError';
import { MissingRequiredFieldError } from '@/validations/errors/MissingRequiredFieldError';
import { SignUpBody, SignUpValidator } from '@/validations/signUpValidator';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = bodyParser(event.body);

    SignUpValidator.validate(body as SignUpBody);

    const signUpCommand = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body.email,
      Password: body.password,
      UserAttributes: [{ Name: 'name', Value: body.name }],
    });

    const { UserSub, UserConfirmed } = await cognitoClient.send(signUpCommand);

    return response(201, {
      userId: UserSub,
      isConfirmed: UserConfirmed,
    });
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      return response(409, {
        error: 'This e-mail is already in use.',
      });
    }

    if (error instanceof MissingRequiredFieldError) {
      return response(400, {
        error: error.message,
      });
    }

    if (error instanceof InvalidParamError) {
      return response(400, {
        error: error.message,
      });
    }

    if (error instanceof InvalidParameterException) {
      return response(400, {
        error: error.message,
      });
    }

    return response(500, {
      error: error.name, // 'Internal Server Error'
    });
  }
}
