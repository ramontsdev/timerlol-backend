import { Router } from "express";
import { signUpController } from "../../presentation/controllers/authentication/SignUp";
import { adaptRoute } from "../adapters/expressRouteAdapter";

export const authenticationRoutes = Router();

authenticationRoutes.post('/auth/sign-up', adaptRoute(signUpController))
