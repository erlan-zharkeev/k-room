import { Router } from 'express'

import { CODES_ENDPOINTS } from 'common'

import { validateRequestMiddleware } from 'src/shared/middleware'

import { VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION, validatePasswordRecoveryCodeController } from './index'

export const validatePasswordRecoveryCodeRouter = Router()

validatePasswordRecoveryCodeRouter.post(
  CODES_ENDPOINTS.validateEmailCodePasswordRecovery,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequestMiddleware,
  validatePasswordRecoveryCodeController
)
