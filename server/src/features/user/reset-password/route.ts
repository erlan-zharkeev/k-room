import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { resetPassword } from 'features/user/reset-password'
import { fieldsValidation } from 'features/user/reset-password'

import { validateRequest } from 'shared-middleware'

export const resetPasswordRouter = Router()

resetPasswordRouter.post(UserEndpointsEnum.ResetPassword, fieldsValidation, validateRequest, resetPassword)
