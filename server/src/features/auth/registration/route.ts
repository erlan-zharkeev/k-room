import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { registration } from 'features/auth/registration/controller'
import { fieldsValidation } from 'features/auth/registration/lib'

import { validateRequest } from 'shared-middleware'

export const registrationRouter = Router()

registrationRouter.post(AuthEndpointsEnum.Registration, fieldsValidation, validateRequest, registration)
