import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import { VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION, validatePasswordRecoveryCodeController } from '.'

import { validateRequest } from 'src/shared/middleware'

export const validatePasswordRecoveryCodeRouter = Router()

validatePasswordRecoveryCodeRouter.post(
  CodesEndpointsEnum.ValidateEmailCodePasswordRecovery,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  validatePasswordRecoveryCodeController
)
