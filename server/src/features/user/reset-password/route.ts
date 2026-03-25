import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { validateRequest } from 'shared-middleware'

import { resetPassword } from './controller'
import { fieldsValidation } from './lib'

export const resetPasswordRouter = Router()

resetPasswordRouter.post(UserEndpointsEnum.ResetPassword, fieldsValidation, validateRequest, resetPassword)
