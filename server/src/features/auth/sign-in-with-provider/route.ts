import { AuthEndpointsEnum } from 'common-types'
import { Router } from 'express'

import { signInWithProvider } from './controller'

export const providerLoginRouter = Router()

providerLoginRouter.get(AuthEndpointsEnum.ProviderLogin, signInWithProvider)
