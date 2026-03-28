import { Router } from 'express'
import { accessTokenValidator } from 'src/features/auth'
import { getUserData } from 'src/features/user/get-user-data'

import { UserEndpointsEnum } from 'common'

export const getUserRouter = Router()

getUserRouter.get(UserEndpointsEnum.GetUserData, accessTokenValidator, getUserData)
