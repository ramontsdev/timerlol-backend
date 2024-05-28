import { Router } from "express";
import { confirmAccountEmailController } from "../../presentation/controllers/authentication/ConfirmAccountEmail";
import { forgetPasswordController } from "../../presentation/controllers/authentication/ForgetPassword";
import { resendConfirmationCodeController } from "../../presentation/controllers/authentication/ResendConfirmationCode";
import { signUpController } from "../../presentation/controllers/authentication/SignUp";
import { adaptRoute } from "../adapters/expressRouteAdapter";

export const authenticationRoutes = Router();

authenticationRoutes.post('/auth/sign-up', adaptRoute(signUpController));
authenticationRoutes.post('/auth/confirm-account-email', adaptRoute(confirmAccountEmailController));
authenticationRoutes.post('/auth/resend-confirmation-code', adaptRoute(resendConfirmationCodeController));
authenticationRoutes.post('/auth/forget-password', adaptRoute(forgetPasswordController));
