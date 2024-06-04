import { Router } from "express";
import { meController } from "../../presentation/controllers/users/MeController";
import { authenticationMiddleware } from "../../presentation/middlewares/AuthenticationMiddleware";
import { adaptRoute } from "../adapters/expressRouteAdapter";
import { middlewareAdapter } from "../adapters/middlewareAdpter";

export const usersRoutes = Router();

usersRoutes.get('/users/me', middlewareAdapter(authenticationMiddleware), adaptRoute(meController))
