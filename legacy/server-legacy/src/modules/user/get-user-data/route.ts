import { USER_ENDPOINTS } from 'common'
import { Router } from 'express'

import { accessTokenValidatorMiddleware } from 'src/modules/auth'

import { getUserDataController } from './controller'

export const getUserRouter = Router()

getUserRouter.get(USER_ENDPOINTS.getUserData, accessTokenValidatorMiddleware, getUserDataController)
