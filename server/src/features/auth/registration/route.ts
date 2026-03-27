import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { registration } from 'features/auth/registration'
import { fieldsValidation } from 'features/auth/registration'

import { validateRequest } from 'shared-middleware'

export const registrationRouter = Router()

registrationRouter.post(AuthEndpointsEnum.Registration, fieldsValidation, validateRequest, registration)
