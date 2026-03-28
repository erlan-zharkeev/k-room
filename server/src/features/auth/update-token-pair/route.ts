import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { refreshTokenValidator } from 'src/features/auth'
import { updateTokensPair } from 'src/features/auth/update-token-pair'

export const updateTokenPairRouter = Router()

updateTokenPairRouter.get(AuthEndpointsEnum.UpdateTokensPair, refreshTokenValidator, updateTokensPair)
