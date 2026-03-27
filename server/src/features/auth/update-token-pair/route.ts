import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { refreshTokenValidator } from 'features/auth'
import { updateTokensPair } from 'features/auth/update-token-pair'

export const updateTokenPairRouter = Router()

updateTokenPairRouter.get(AuthEndpointsEnum.UpdateTokensPair, refreshTokenValidator, updateTokensPair)
