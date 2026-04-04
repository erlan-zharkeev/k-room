import { Router } from 'express'

import { AUTH_ENDPOINTS } from 'common'

import { accessTokenValidatorMiddleware } from './../shared'
import { logoutController } from './controller'

export const logoutRouter = Router()

logoutRouter.post(AUTH_ENDPOINTS.logout, accessTokenValidatorMiddleware, logoutController)
