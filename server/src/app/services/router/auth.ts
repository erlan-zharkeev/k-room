import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import {
  accessTokenValidator,
  CONFIRM_EMAIL_FIELDS_VALIDATION,
  confirmEmail,
  login,
  LOGIN_FIELDS_VALIDATION,
  logout,
  refreshTokenValidator,
  registration,
  REGISTRATION_FIELDS_VALIDATION,
  sendConfirmationLink,
  signInWithProvider,
  updateTokensPair
} from 'src/features/auth'

import { validateRequest } from 'src/shared/middleware'

export const authRouter = Router()

authRouter.post(AuthEndpointsEnum.ConfirmEmail, CONFIRM_EMAIL_FIELDS_VALIDATION, validateRequest, confirmEmail)
authRouter.post(AuthEndpointsEnum.Login, LOGIN_FIELDS_VALIDATION, validateRequest, login)
authRouter.post(AuthEndpointsEnum.Registration, REGISTRATION_FIELDS_VALIDATION, validateRequest, registration)
authRouter.post(AuthEndpointsEnum.SendEmailConfirmationLink, sendConfirmationLink)
authRouter.post(AuthEndpointsEnum.ProviderLogin, signInWithProvider)
authRouter.get(AuthEndpointsEnum.UpdateTokensPair, refreshTokenValidator, updateTokensPair)
authRouter.post(AuthEndpointsEnum.Logout, accessTokenValidator, logout)
