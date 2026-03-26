import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { confirmEmail } from 'features/auth/confirm-email/controller'
import { fieldsValidation } from 'features/auth/confirm-email/lib'

import { validateRequest } from 'shared-middleware'

export const confirmEmailRouter = Router()

confirmEmailRouter.post(AuthEndpointsEnum.ConfirmEmail, fieldsValidation, validateRequest, confirmEmail)
