import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { resetPassword } from 'features/user/reset-password/controller'
import { fieldsValidation } from 'features/user/reset-password/lib'

import { validateRequest } from 'shared-middleware'

export const resetPasswordRouter = Router()

resetPasswordRouter.post(UserEndpointsEnum.ResetPassword, fieldsValidation, validateRequest, resetPassword)
