import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { resetPassword } from 'src/features/user/reset-password'
import { fieldsValidation } from 'src/features/user/reset-password'

import { validateRequest } from 'src/shared/middleware'

export const resetPasswordRouter = Router()

resetPasswordRouter.post(UserEndpointsEnum.ResetPassword, fieldsValidation, validateRequest, resetPassword)
