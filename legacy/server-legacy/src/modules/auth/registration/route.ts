import { AUTH_ENDPOINTS } from 'common'
import { Router } from 'express'

import { validateRequestMiddleware } from 'src/shared/middleware/validate-request-middleware'

import { registrationController } from './controller'
import { REGISTRATION_FIELDS_VALIDATION } from './lib/fields-validation'

export const registrationRouter = Router()

registrationRouter.post(
  AUTH_ENDPOINTS.registration,
  REGISTRATION_FIELDS_VALIDATION,
  validateRequestMiddleware,
  registrationController
)
