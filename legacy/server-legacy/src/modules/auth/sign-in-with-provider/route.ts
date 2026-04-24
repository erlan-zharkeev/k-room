import { AUTH_ENDPOINTS } from 'common'
import { Router } from 'express'

import { signInWithProviderController } from './controller'

export const providerLoginRouter = Router()

providerLoginRouter.post(AUTH_ENDPOINTS.providerLogin, signInWithProviderController)
