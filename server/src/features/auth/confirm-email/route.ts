import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { validateRequest } from 'src/shared/middleware'

import { confirmEmail } from './controller'
import { CONFIRM_EMAIL_FIELDS_VALIDATION } from './lib'

export const confirmEmailRouter = Router()

confirmEmailRouter.post(AuthEndpointsEnum.ConfirmEmail, CONFIRM_EMAIL_FIELDS_VALIDATION, validateRequest, confirmEmail)
