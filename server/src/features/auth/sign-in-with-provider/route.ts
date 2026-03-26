import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { signInWithProvider } from 'features/auth/sign-in-with-provider/controller'

export const providerLoginRouter = Router()

providerLoginRouter.get(AuthEndpointsEnum.ProviderLogin, signInWithProvider)
