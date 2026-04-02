import { Router } from 'express'

import { AUTH_ENDPOINTS } from 'common'

import { refreshTokenValidator } from './../shared'
import { updateTokensPairController } from './controller'

export const updateTokenPairRouter = Router()

updateTokenPairRouter.post(AUTH_ENDPOINTS.updateTokensPair, refreshTokenValidator, updateTokensPairController)
