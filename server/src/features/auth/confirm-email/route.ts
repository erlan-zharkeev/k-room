import { Router } from 'express'

import { AUTH_ENDPOINTS } from 'common'

import { validateRequestMiddleware } from 'src/shared/middleware'

import { confirmEmailController } from './controller'
import { CONFIRM_EMAIL_FIELDS_VALIDATION } from './lib'

export const confirmEmailRouter = Router()

confirmEmailRouter.post(
  AUTH_ENDPOINTS.confirmEmail,
  CONFIRM_EMAIL_FIELDS_VALIDATION,
  validateRequestMiddleware,
  confirmEmailController
)
