import { Router } from 'express'
import { registration, REGISTRATION_FIELDS_VALIDATION } from 'src/features/auth'
import { validateRequest } from 'src/shared/middleware'

import { AuthEndpointsEnum } from 'common'

export const registrationRouter = Router()

registrationRouter.post(AuthEndpointsEnum.Registration, REGISTRATION_FIELDS_VALIDATION, validateRequest, registration)
