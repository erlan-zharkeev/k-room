import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { refreshTokenValidator } from './../shared'
import { updateTokensPairController } from './controller'

export const updateTokenPairRouter = Router()

updateTokenPairRouter.get(AuthEndpointsEnum.UpdateTokensPair, refreshTokenValidator, updateTokensPairController)
