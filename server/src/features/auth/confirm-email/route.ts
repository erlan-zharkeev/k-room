import { Router } from 'express'

import { AuthEndpointsEnum } from 'common'

import { validateRequest } from 'shared-middleware'

import { confirmEmail } from './controller'
import { fieldsValidation } from './lib'

export const confirmEmailRouter = Router()

confirmEmailRouter.post(AuthEndpointsEnum.ConfirmEmail, fieldsValidation, validateRequest, confirmEmail)
