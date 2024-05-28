import { Router } from "express";
import { confirmAccountEmailController } from "../../presentation/controllers/authentication/ConfirmAccountEmail";
import { forgetPasswordController } from "../../presentation/controllers/authentication/ForgetPassword";
import { resendConfirmationCodeController } from "../../presentation/controllers/authentication/ResendConfirmationCode";
import { resetPasswordController } from "../../presentation/controllers/authentication/ResetPasswordController";
import { signInController } from "../../presentation/controllers/authentication/SignIn";
import { signUpController } from "../../presentation/controllers/authentication/SignUp";
import { adaptRoute } from "../adapters/expressRouteAdapter";

export const authenticationRoutes = Router();

authenticationRoutes.post('/auth/sign-up', adaptRoute(signUpController));
authenticationRoutes.post('/auth/confirm-account-email', adaptRoute(confirmAccountEmailController));
authenticationRoutes.post('/auth/resend-confirmation-code', adaptRoute(resendConfirmationCodeController));
authenticationRoutes.post('/auth/forget-password', adaptRoute(forgetPasswordController));
authenticationRoutes.post('/auth/reset-password', adaptRoute(resetPasswordController));
authenticationRoutes.post('/auth/sign-in', adaptRoute(signInController));
