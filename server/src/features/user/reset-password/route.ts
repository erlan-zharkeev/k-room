import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { RESET_PASSWORD_FIELDS_VALIDATION, resetPasswordController } from '.'

import { validateRequest } from 'src/shared/middleware'

export const resetPasswordRouter = Router()

resetPasswordRouter.post(
  UserEndpointsEnum.ResetPassword,
  RESET_PASSWORD_FIELDS_VALIDATION,
  validateRequest,
  resetPasswordController
)
