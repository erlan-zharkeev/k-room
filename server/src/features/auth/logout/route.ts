import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { accessTokenValidator } from '../shared/middleware/access-token-validator'

import { logout } from './controller'

export const logoutRouter = Router()

logoutRouter.post(AuthEndpointsEnum.Logout, accessTokenValidator, logout)
