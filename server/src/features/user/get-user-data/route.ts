import { Router } from 'express'

import { USER_ENDPOINTS } from 'common'

import { accessTokenValidator } from 'src/features/auth'

import { getUserDataController } from './index'

export const getUserRouter = Router()

getUserRouter.get(USER_ENDPOINTS.getUserData, accessTokenValidator, getUserDataController)
