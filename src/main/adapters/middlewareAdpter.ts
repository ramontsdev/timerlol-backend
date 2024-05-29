import { NextFunction, Request, Response } from "express";
import { HttpRequest } from "../../presentation/protocols/http";
import { IMiddleware } from "../../presentation/protocols/middleware";

export function middlewareAdapter(middleware: IMiddleware) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      headers: request.headers,
      params: request.params,
      query: request.query,
    }

    const httpResponse = await middleware.handle(httpRequest);

    if (httpResponse.statusCode !== 200) {
      return response.status(httpResponse.statusCode).json(httpResponse.body);
    }

    request.metadata = {
      ...request.metadata,
      accountId: httpResponse.body.accountId
    }

    next();
  }
}
