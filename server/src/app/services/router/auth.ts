import { Router } from 'express'

import { AUTH_ENDPOINTS } from 'common'

import {
  accessTokenValidator,
  CONFIRM_EMAIL_FIELDS_VALIDATION,
  confirmEmailController,
  LOGIN_FIELDS_VALIDATION,
  loginController,
  logoutController,
  refreshTokenValidator,
  REGISTRATION_FIELDS_VALIDATION,
  registrationController,
  sendConfirmationLinkController,
  signInWithProviderController,
  updateTokensPairController
} from 'src/features/auth'

import { validateRequest } from 'src/shared/middleware'

export const authRouter = Router()

authRouter.post(
  AUTH_ENDPOINTS.confirmEmail,
  CONFIRM_EMAIL_FIELDS_VALIDATION,
  validateRequest,
  confirmEmailController
)
authRouter.post(AUTH_ENDPOINTS.login, LOGIN_FIELDS_VALIDATION, validateRequest, loginController)
authRouter.post(AUTH_ENDPOINTS.registration, REGISTRATION_FIELDS_VALIDATION, validateRequest, registrationController)
authRouter.post(AUTH_ENDPOINTS.sendEmailConfirmationLink, sendConfirmationLinkController)
authRouter.post(AUTH_ENDPOINTS.providerLogin, signInWithProviderController)
authRouter.post(AUTH_ENDPOINTS.updateTokensPair, refreshTokenValidator, updateTokensPairController)
authRouter.post(AUTH_ENDPOINTS.logout, accessTokenValidator, logoutController)
