import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import { validatePasswordRecoveryCode } from 'features/code/validate-password-recovery-code'
import { fieldsValidation } from 'features/code/validate-password-recovery-code'

import { validateRequest } from 'shared-middleware'

export const validatePasswordRecoveryCodeRouter = Router()

validatePasswordRecoveryCodeRouter.post(
  CodesEndpointsEnum.ValidateEmailCodePasswordRecovery,
  fieldsValidation,
  validateRequest,
  validatePasswordRecoveryCode
)
