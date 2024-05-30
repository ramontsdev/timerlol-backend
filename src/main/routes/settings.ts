import { Router } from "express";
import { getSettingsController } from "../../presentation/controllers/settings/GetSettings";
import { updateSettingsController } from "../../presentation/controllers/settings/UpdateSettings";
import { authenticationMiddleware } from "../../presentation/middlewares/AuthenticationMiddleware";
import { adaptRoute } from "../adapters/expressRouteAdapter";
import { middlewareAdapter } from "../adapters/middlewareAdpter";

export const settingsRoutes = Router();

settingsRoutes.get('/settings/:settingsId',
  middlewareAdapter(authenticationMiddleware),
  adaptRoute(getSettingsController)
)
settingsRoutes.put('/settings/:settingsId',
  middlewareAdapter(authenticationMiddleware),
  adaptRoute(updateSettingsController)
)
