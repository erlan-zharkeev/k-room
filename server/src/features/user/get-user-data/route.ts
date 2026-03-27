import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { accessTokenValidator } from 'features/auth'
import { getUserData } from 'features/user/get-user-data'

export const getUserRouter = Router()

getUserRouter.get(UserEndpointsEnum.GetUserData, accessTokenValidator, getUserData)
