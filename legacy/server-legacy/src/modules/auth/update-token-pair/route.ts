import { AUTH_ENDPOINTS } from 'common'
import { Router } from 'express'

import { refreshTokenValidatorMiddleware } from '../shared/middleware/refresh-token-validator-middleware'

import { updateTokensPairController } from './controller'

export const updateTokenPairRouter = Router()

updateTokenPairRouter.post(AUTH_ENDPOINTS.updateTokensPair, refreshTokenValidatorMiddleware, updateTokensPairController)
