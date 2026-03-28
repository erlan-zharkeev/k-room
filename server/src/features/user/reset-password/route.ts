import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { validateRequest } from 'src/shared/middleware'

import { RESET_PASSWORD_FIELDS_VALIDATION, resetPasswordController } from '.'

export const resetPasswordRouter = Router()

resetPasswordRouter.post(
  UserEndpointsEnum.ResetPassword,
  RESET_PASSWORD_FIELDS_VALIDATION,
  validateRequest,
  resetPasswordController
)
