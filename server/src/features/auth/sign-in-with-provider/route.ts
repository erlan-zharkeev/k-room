import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { signInWithProviderController } from '.'

export const providerLoginRouter = Router()

providerLoginRouter.post(AuthEndpointsEnum.ProviderLogin, signInWithProviderController)
