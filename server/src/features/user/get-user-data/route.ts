import { UserEndpointsEnum } from 'common-types'
import { Router } from 'express'
import { accessTokenValidator } from 'features/auth'

import { getUserData } from './controller'
export const getUserRouter = Router()
getUserRouter.get(UserEndpointsEnum.GetUserData, accessTokenValidator, getUserData)
