import { Router } from 'express'
import { signInWithProvider } from 'src/features/auth/sign-in-with-provider'

import { AuthEndpointsEnum } from 'common'

export const providerLoginRouter = Router()

providerLoginRouter.post(AuthEndpointsEnum.ProviderLogin, signInWithProvider)
