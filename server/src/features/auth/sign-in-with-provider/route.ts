import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { signInWithProvider } from '.'

export const providerLoginRouter = Router()

providerLoginRouter.post(AuthEndpointsEnum.ProviderLogin, signInWithProvider)
