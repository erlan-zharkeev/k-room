import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { accessTokenValidator } from 'src/features/auth'
import { logout } from 'src/features/auth/logout'

export const logoutRouter = Router()

logoutRouter.post(AuthEndpointsEnum.Logout, accessTokenValidator, logout)
