import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import { validateRequest } from 'src/shared/middleware'

import { VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION, validatePasswordRecoveryCodeController } from '.'

export const validatePasswordRecoveryCodeRouter = Router()

validatePasswordRecoveryCodeRouter.post(
  CodesEndpointsEnum.ValidateEmailCodePasswordRecovery,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  validatePasswordRecoveryCodeController
)
