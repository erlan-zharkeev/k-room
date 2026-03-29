import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { accessTokenValidator } from 'src/features/auth'

import { getUserDataController } from './index'

export const getUserRouter = Router()

getUserRouter.get(UserEndpointsEnum.GetUserData, accessTokenValidator, getUserDataController)
