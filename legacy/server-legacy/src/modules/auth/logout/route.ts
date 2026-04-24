import { AUTH_ENDPOINTS } from 'common'
import { Router } from 'express'

import { accessTokenValidatorMiddleware } from '../shared/middleware/access-token-validator-middleware'

import { logoutController } from './controller'

export const logoutRouter = Router()

logoutRouter.post(AUTH_ENDPOINTS.logout, accessTokenValidatorMiddleware, logoutController)
