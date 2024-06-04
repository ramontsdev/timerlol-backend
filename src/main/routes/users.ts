import { Router } from "express";
import { myPlanController } from "../../presentation/controllers/Plans/MyPlanController";
import { meController } from "../../presentation/controllers/users/MeController";
import { authenticationMiddleware } from "../../presentation/middlewares/AuthenticationMiddleware";
import { adaptRoute } from "../adapters/expressRouteAdapter";
import { middlewareAdapter } from "../adapters/middlewareAdpter";

export const usersRoutes = Router();

usersRoutes.get('/users/me', middlewareAdapter(authenticationMiddleware), adaptRoute(meController))
usersRoutes.get('/users/my-plan/:planId', middlewareAdapter(authenticationMiddleware), adaptRoute(myPlanController))
