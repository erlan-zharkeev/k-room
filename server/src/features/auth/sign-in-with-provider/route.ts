import { Router } from 'express'

import { AuthEndpointsEnum } from 'common-types'

import { signInWithProvider } from './controller'

export const providerLoginRouter = Router()

providerLoginRouter.get(AuthEndpointsEnum.ProviderLogin, signInWithProvider)
