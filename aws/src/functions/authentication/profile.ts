import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';

import { cognitoClient } from '@/libs/cognitoClient';
import { response } from '@/utils/response';

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub as string;

    const command = new AdminGetUserCommand({
      Username: userId,
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
    });

    const { UserAttributes } = await cognitoClient.send(command);

    const profile = UserAttributes?.reduce((profileObj, { Name, Value }) => {
      const keyMap = {
        given_name: 'firstName',
        family_name: 'lastName',
        email_verified: 'emailVerified',
        sub: 'id',
      };

      return {
        ...profileObj,
        [keyMap[Name as keyof typeof keyMap] ?? Name]: Value,
      };
    }, {});

    return response(200, { profile });
  } catch (error) {
    return response(500, {
      error: error.name,
    });
  }
}
