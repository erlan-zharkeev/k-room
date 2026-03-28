import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { registration } from 'src/features/auth/registration'
import { fieldsValidation } from 'src/features/auth/registration'

import { validateRequest } from 'src/shared/middleware'

export const registrationRouter = Router()

registrationRouter.post(AuthEndpointsEnum.Registration, fieldsValidation, validateRequest, registration)
