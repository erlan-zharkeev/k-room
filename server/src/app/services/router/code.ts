import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import {
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  sendPasswordRecoveryCodeController,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validatePasswordRecoveryCodeController
} from 'src/features/code'

import { validateRequest } from 'src/shared/middleware'

export const codeRouter = Router()

codeRouter.post(
  CodesEndpointsEnum.SendEmailCodePasswordRecovery,
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  sendPasswordRecoveryCodeController
)
codeRouter.post(
  CodesEndpointsEnum.ValidateEmailCodePasswordRecovery,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  validatePasswordRecoveryCodeController
)
