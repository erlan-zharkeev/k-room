import { AuthEndpointsEnum } from 'common-types'
import { Router } from 'express'
import { validateRequest } from 'shared-middleware'

import { registration } from './controller'
import { fieldsValidation } from './lib'

export const registrationRouter = Router()

registrationRouter.post(AuthEndpointsEnum.Registration, fieldsValidation, validateRequest, registration)
