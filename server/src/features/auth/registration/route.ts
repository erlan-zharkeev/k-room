import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { validateRequest } from 'src/shared/middleware'

import { registration } from './controller'
import { REGISTRATION_FIELDS_VALIDATION } from './lib'

export const registrationRouter = Router()

registrationRouter.post(AuthEndpointsEnum.Registration, REGISTRATION_FIELDS_VALIDATION, validateRequest, registration)
