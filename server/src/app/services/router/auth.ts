import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

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
  AuthEndpointsEnum.ConfirmEmail,
  CONFIRM_EMAIL_FIELDS_VALIDATION,
  validateRequest,
  confirmEmailController
)
authRouter.post(AuthEndpointsEnum.Login, LOGIN_FIELDS_VALIDATION, validateRequest, loginController)
authRouter.post(AuthEndpointsEnum.Registration, REGISTRATION_FIELDS_VALIDATION, validateRequest, registrationController)
authRouter.post(AuthEndpointsEnum.SendEmailConfirmationLink, sendConfirmationLinkController)
authRouter.post(AuthEndpointsEnum.ProviderLogin, signInWithProviderController)
authRouter.get(AuthEndpointsEnum.UpdateTokensPair, refreshTokenValidator, updateTokensPairController)
authRouter.post(AuthEndpointsEnum.Logout, accessTokenValidator, logoutController)
