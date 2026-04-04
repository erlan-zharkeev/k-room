import { Router } from 'express'

import { USER_ENDPOINTS } from 'common'

import { validateRequestMiddleware } from 'src/shared/middleware'

import { RESET_PASSWORD_FIELDS_VALIDATION, resetPasswordController } from './index'

export const resetPasswordRouter = Router()

resetPasswordRouter.post(
  USER_ENDPOINTS.resetPassword,
  RESET_PASSWORD_FIELDS_VALIDATION,
  validateRequestMiddleware,
  resetPasswordController
)
