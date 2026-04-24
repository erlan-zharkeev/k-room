import { AUTH_ENDPOINTS } from 'common'
import { Router } from 'express'

import { validateRequestMiddleware } from 'src/shared/middleware/validate-request-middleware'

import { confirmEmailController } from './controller'
import { CONFIRM_EMAIL_FIELDS_VALIDATION } from './lib/fields-validation'

export const confirmEmailRouter = Router()

confirmEmailRouter.post(
  AUTH_ENDPOINTS.confirmEmail,
  CONFIRM_EMAIL_FIELDS_VALIDATION,
  validateRequestMiddleware,
  confirmEmailController
)
