import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { signInWithProvider } from 'src/features/auth/sign-in-with-provider'

export const providerLoginRouter = Router()

providerLoginRouter.post(AuthEndpointsEnum.ProviderLogin, signInWithProvider)
