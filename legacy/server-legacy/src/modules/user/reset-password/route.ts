import { USER_ENDPOINTS } from 'common'
import { Router } from 'express'

import { validateRequestMiddleware } from 'src/shared/middleware/validate-request-middleware'

import { resetPasswordController } from './controller'
import { RESET_PASSWORD_FIELDS_VALIDATION } from './lib/fields-validation'

export const resetPasswordRouter = Router()

resetPasswordRouter.post(
  USER_ENDPOINTS.resetPassword,
  RESET_PASSWORD_FIELDS_VALIDATION,
  validateRequestMiddleware,
  resetPasswordController
)
