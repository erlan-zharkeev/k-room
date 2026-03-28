import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import { validatePasswordRecoveryCode } from 'src/features/code/validate-password-recovery-code'
import { fieldsValidation } from 'src/features/code/validate-password-recovery-code'

import { validateRequest } from 'src/shared/middleware'

export const validatePasswordRecoveryCodeRouter = Router()

validatePasswordRecoveryCodeRouter.post(
  CodesEndpointsEnum.ValidateEmailCodePasswordRecovery,
  fieldsValidation,
  validateRequest,
  validatePasswordRecoveryCode
)
