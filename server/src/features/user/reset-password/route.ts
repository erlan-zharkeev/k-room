import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { resetPassword } from 'src/features/user/reset-password'
import { RESET_PASSWORD_FIELDS_VALIDATION } from 'src/features/user/reset-password'

import { validateRequest } from 'src/shared/middleware'

export const resetPasswordRouter = Router()

resetPasswordRouter.post(UserEndpointsEnum.ResetPassword, RESET_PASSWORD_FIELDS_VALIDATION, validateRequest, resetPassword)
