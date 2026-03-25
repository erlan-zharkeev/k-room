import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import { validateRequest } from 'shared-middleware'

import { validatePasswordRecoveryCode } from './controller'
import { fieldsValidation } from './lib'

export const validatePasswordRecoveryCodeRouter = Router()

validatePasswordRecoveryCodeRouter.post(
  CodesEndpointsEnum.ValidateEmailCodePasswordRecovery,
  fieldsValidation,
  validateRequest,
  validatePasswordRecoveryCode
)
