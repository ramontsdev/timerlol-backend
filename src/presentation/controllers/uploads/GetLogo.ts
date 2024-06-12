import { IFindUserById } from "../../../domain/use-cases/user/find-user-by-id";
import { prismaClient } from "../../../infra/database/postgresDb";
import { DbFindUserById } from "../../../infra/database/repositories/user/DbFindUserById";
import { badRequest, ok, serverError, unauthorized } from "../../helpers/httpHelpers";
import { IController } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

class GetLogo implements IController {
  constructor(
    private readonly findUserByIdRepository: IFindUserById
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest;
      if (!accountId) {
        return unauthorized();
      };

      const user = await this.findUserByIdRepository.findById(accountId);
      if (!user) {
        return badRequest({ error: 'Invalid user id' });
      };

      const logo = await prismaClient.logo.findFirst({
        where: { userId: accountId }
      });
      if (!logo) {
        return ok();
      }

      return ok({
        ...logo,
        url: `${process.env.AWS_BUCKET_URL}/${logo.filename}`
      });
    } catch (err) {
      const error = err as Error;

      return serverError({ error: error.message })
    };
  }
}

const dbFindUserById = new DbFindUserById();
export const getLogo = new GetLogo(dbFindUserById);
