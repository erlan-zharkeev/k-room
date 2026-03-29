import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { signInWithProviderController } from './index'

export const providerLoginRouter = Router()

providerLoginRouter.post(AuthEndpointsEnum.ProviderLogin, signInWithProviderController)
