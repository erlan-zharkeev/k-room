import { Router } from 'express'

import { AUTH_ENDPOINTS } from 'common'

import { validateRequestMiddleware } from 'src/shared/middleware'

import { registrationController } from './controller'
import { REGISTRATION_FIELDS_VALIDATION } from './lib'

export const registrationRouter = Router()

registrationRouter.post(
  AUTH_ENDPOINTS.registration,
  REGISTRATION_FIELDS_VALIDATION,
  validateRequestMiddleware,
  registrationController
)
