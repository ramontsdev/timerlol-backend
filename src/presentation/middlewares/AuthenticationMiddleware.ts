import { IDecrypter } from "../../domain/use-cases/cryptography/decrypter";
import { JwtAdapter } from "../../infra/cryptography/jwt-adapter";
import { ok, serverError, unauthorized } from "../helpers/http-helpers";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { IMiddleware } from "../protocols/middleware";

class AuthenticationMiddleware implements IMiddleware {

  constructor(private readonly decrypter: IDecrypter) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { authorization } = httpRequest.headers;

      if (!authorization) {
        return unauthorized();
      }

      const [bearer, token] = authorization.split(' ')

      if (bearer !== 'Bearer') {
        return unauthorized();
      }

      const payload = this.decrypter.decrypt(token);
      if (!payload) {
        return unauthorized();
      }

      return ok({
        accountId: payload.sub
      })
    } catch (error) {
      return serverError();
    }
  }
}

const jwtAdapter = new JwtAdapter();
export const authenticationMiddleware = new AuthenticationMiddleware(jwtAdapter);
