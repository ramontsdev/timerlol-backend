import { Request, Response } from "express";
import { IController } from "../../presentation/protocols/controller";
import { HttpRequest } from "../../presentation/protocols/http";

export function adaptRoute(controller: IController) {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      headers: request.headers,
      params: request.params,
      query: request.query,
      accountId: request.metadata.accountId
    }

    const httpResponse = await controller.handle(httpRequest);

    return response.status(httpResponse.statusCode).json(httpResponse.body);
  }
}
