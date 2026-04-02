import { Router } from 'express'

import { AUTH_ENDPOINTS } from 'common'

import { accessTokenValidator } from './../shared'
import { logoutController } from './controller'

export const logoutRouter = Router()

logoutRouter.post(AUTH_ENDPOINTS.logout, accessTokenValidator, logoutController)
