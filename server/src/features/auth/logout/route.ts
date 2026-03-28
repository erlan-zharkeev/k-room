import { Router } from 'express'
import { accessTokenValidator } from 'src/features/auth'
import { logout } from 'src/features/auth'

import { AuthEndpointsEnum } from 'common'

export const logoutRouter = Router()

logoutRouter.post(AuthEndpointsEnum.Logout, accessTokenValidator, logout)
