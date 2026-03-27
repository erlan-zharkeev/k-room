import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { confirmEmail } from 'features/auth/confirm-email'
import { fieldsValidation } from 'features/auth/confirm-email'

import { validateRequest } from 'shared-middleware'

export const confirmEmailRouter = Router()

confirmEmailRouter.post(AuthEndpointsEnum.ConfirmEmail, fieldsValidation, validateRequest, confirmEmail)
