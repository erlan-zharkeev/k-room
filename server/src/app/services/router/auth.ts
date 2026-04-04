import { Router } from 'express'

import { AUTH_ENDPOINTS } from 'common'

import {
  accessTokenValidatorMiddleware,
  CONFIRM_EMAIL_FIELDS_VALIDATION,
  confirmEmailController,
  LOGIN_FIELDS_VALIDATION,
  loginController,
  logoutController,
  refreshTokenValidatorMiddleware,
  REGISTRATION_FIELDS_VALIDATION,
  registrationController,
  sendConfirmationLinkController,
  signInWithProviderController,
  updateTokensPairController
} from 'src/features/auth'

import { validateRequestMiddleware } from 'src/shared/middleware'

export const authRouter = Router()

authRouter.post(
  AUTH_ENDPOINTS.confirmEmail,
  CONFIRM_EMAIL_FIELDS_VALIDATION,
  validateRequestMiddleware,
  confirmEmailController
)
authRouter.post(AUTH_ENDPOINTS.login, LOGIN_FIELDS_VALIDATION, validateRequestMiddleware, loginController)
authRouter.post(
  AUTH_ENDPOINTS.registration,
  REGISTRATION_FIELDS_VALIDATION,
  validateRequestMiddleware,
  registrationController
)
authRouter.post(AUTH_ENDPOINTS.sendEmailConfirmationLink, sendConfirmationLinkController)
authRouter.post(AUTH_ENDPOINTS.providerLogin, signInWithProviderController)
authRouter.post(AUTH_ENDPOINTS.updateTokensPair, refreshTokenValidatorMiddleware, updateTokensPairController)
authRouter.post(AUTH_ENDPOINTS.logout, accessTokenValidatorMiddleware, logoutController)
