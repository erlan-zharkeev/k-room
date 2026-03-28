import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import {
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  sendPasswordRecoveryCode,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validatePasswordRecoveryCode
} from 'src/features/code'

import { validateRequest } from 'src/shared/middleware'

export const codeRouter = Router()

codeRouter.post(
  CodesEndpointsEnum.SendEmailCodePasswordRecovery,
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  sendPasswordRecoveryCode
)
codeRouter.post(
  CodesEndpointsEnum.ValidateEmailCodePasswordRecovery,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  validatePasswordRecoveryCode
)
