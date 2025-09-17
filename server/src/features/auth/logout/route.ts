import { AuthEndpointsEnum } from 'common-types'
import { Router } from 'express'

import { accessTokenValidator } from '../~shared'
import { logout } from './controller'

export const logoutRouter = Router()

logoutRouter.post(AuthEndpointsEnum.Logout, accessTokenValidator, logout)
