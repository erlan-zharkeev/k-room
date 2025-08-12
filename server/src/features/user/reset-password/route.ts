import { UserEndpointsEnum } from 'common-types'
import { Router } from 'express'
import { validateRequest } from 'shared-middleware'

import { resetPassword } from './controller'
import { fieldsValidation } from './lib'

export const resetPasswordRouter = Router()

resetPasswordRouter.post(UserEndpointsEnum.ResetPassword, fieldsValidation, validateRequest, resetPassword)
