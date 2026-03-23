import { Router } from 'express'

import { AuthEndpointsEnum } from 'common-types'

import { refreshTokenValidator } from 'features/auth'

import { updateTokensPair } from './controller'

export const updateTokenPairRouter = Router()

updateTokenPairRouter.get(AuthEndpointsEnum.UpdateTokensPair, refreshTokenValidator, updateTokensPair)
