import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { accessTokenValidator } from 'features/auth'
import { logout } from 'features/auth/logout/controller'

export const logoutRouter = Router()

logoutRouter.post(AuthEndpointsEnum.Logout, accessTokenValidator, logout)
