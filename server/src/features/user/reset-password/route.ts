import { UserEndpointsEnum } from 'common-types'
import { Router } from 'express'

import { resetPassword } from './controller'

export const resetPasswordRouter = Router()

resetPasswordRouter.post(UserEndpointsEnum.ResetPassword, resetPassword)
