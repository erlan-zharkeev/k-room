import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import { validatePasswordRecoveryCode } from 'src/features/code/validate-password-recovery-code'
import { VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION } from 'src/features/code/validate-password-recovery-code'

import { validateRequest } from 'src/shared/middleware'

export const validatePasswordRecoveryCodeRouter = Router()

validatePasswordRecoveryCodeRouter.post(
  CodesEndpointsEnum.ValidateEmailCodePasswordRecovery,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  validatePasswordRecoveryCode
)
