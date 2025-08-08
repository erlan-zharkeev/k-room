import { AuthEndpointsEnum } from 'common-types'
import { Router } from 'express'

import { refreshTokenValidator } from '../~shared'
import { updateTokensPair } from './controller'

export const updateTokenPairRouter = Router()

updateTokenPairRouter.get(AuthEndpointsEnum.UpdateTokensPair, refreshTokenValidator, updateTokensPair)
