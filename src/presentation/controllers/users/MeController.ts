import { IFindUserById } from "../../../domain/use-cases/user/find-user-by-id";
import { DbFindUserById } from "../../../infra/database/repositories/user/DbFindUserById";
import { notFound, ok, serverError, unauthorized } from "../../helpers/httpHelpers";
import { IController } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

class MeController implements IController {
  constructor(
    private readonly findUserById: IFindUserById
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.accountId) {
        return unauthorized();
      }

      const user = await this.findUserById.findById(httpRequest.accountId)
      if (!user) {
        return notFound({ error: 'User not found.' });
      }

      return ok(user);
    } catch (error) {
      return serverError();
    }
  }
}

export const findUserById = new DbFindUserById();
export const meController = new MeController(findUserById);
