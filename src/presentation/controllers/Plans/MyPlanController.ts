import { prismaClient } from "../../../infra/database/postgresDb";
import { ok, serverError } from "../../helpers/httpHelpers";
import { IController } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

class MyPlanController implements IController {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      httpRequest.params.planId

      const plan = await prismaClient.plan.findUnique({ where: { id: httpRequest.params.planId } })

      return ok(plan)
    } catch (err) {
      const error = err as Error;
      return serverError();
    };
  }
}

export const myPlanController = new MyPlanController();
