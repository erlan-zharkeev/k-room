import { Router } from 'express'

import { CODES_ENDPOINTS } from 'common'

import {
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  sendPasswordRecoveryCodeController,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validatePasswordRecoveryCodeController
} from 'src/features/code'

import { validateRequest } from 'src/shared/middleware'

export const codeRouter = Router()

codeRouter.post(
  CODES_ENDPOINTS.sendEmailCodePasswordRecovery,
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  sendPasswordRecoveryCodeController
)
codeRouter.post(
  CODES_ENDPOINTS.validateEmailCodePasswordRecovery,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  validatePasswordRecoveryCodeController
)
