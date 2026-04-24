import { CODES_ENDPOINTS } from 'common'
import { Router } from 'express'

import { validateRequestMiddleware } from 'src/shared/middleware/validate-request-middleware'

import { validatePasswordRecoveryCodeController } from './controller'
import { VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION } from './lib/fields-validation'

export const validatePasswordRecoveryCodeRouter = Router()

validatePasswordRecoveryCodeRouter.post(
  CODES_ENDPOINTS.validateEmailCodePasswordRecovery,
  VALIDATE_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequestMiddleware,
  validatePasswordRecoveryCodeController
)
