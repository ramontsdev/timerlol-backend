import { Router } from "express";
import multer from "multer";
import { getLogo } from "../../presentation/controllers/uploads/GetLogo";
import { uploadLogo } from "../../presentation/controllers/uploads/UploadLogo";
import { authenticationMiddleware } from "../../presentation/middlewares/AuthenticationMiddleware";
import { adaptRoute } from "../adapters/expressRouteAdapter";
import { middlewareAdapter } from "../adapters/middlewareAdpter";
import { multerConfig } from "../config/multer";

export const uploadsRoutes = Router();

const upload = multer(multerConfig)

uploadsRoutes.post(
  '/uploads',
  middlewareAdapter(authenticationMiddleware),
  upload.single('image'),
  adaptRoute(uploadLogo)
)
uploadsRoutes.get('/uploads',
  middlewareAdapter(authenticationMiddleware),
  adaptRoute(getLogo)
)
