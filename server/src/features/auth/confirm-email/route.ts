import { Router } from 'express'
import { confirmEmail } from 'src/features/auth/confirm-email'
import { fieldsValidation } from 'src/features/auth/confirm-email'
import { validateRequest } from 'src/shared/middleware'

import { AuthEndpointsEnum } from 'common'

export const confirmEmailRouter = Router()

confirmEmailRouter.post(AuthEndpointsEnum.ConfirmEmail, fieldsValidation, validateRequest, confirmEmail)
