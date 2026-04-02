import { Router } from 'express'

import { AUTH_ENDPOINTS } from 'common'

import { signInWithProviderController } from './index'

export const providerLoginRouter = Router()

providerLoginRouter.post(AUTH_ENDPOINTS.providerLogin, signInWithProviderController)
