import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { accessTokenValidator } from './../shared'
import { logoutController } from './controller'

export const logoutRouter = Router()

logoutRouter.post(AuthEndpointsEnum.Logout, accessTokenValidator, logoutController)
