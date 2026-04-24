import { CODES_ENDPOINTS } from 'common'
import { Router } from 'express'

import { validateRequestMiddleware } from 'src/shared/middleware/validate-request-middleware'

import { sendPasswordRecoveryCodeController } from './controller'
import { SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION } from './lib/fields-validation'

export const sendPasswordRecoveryCodeRouter = Router()

sendPasswordRecoveryCodeRouter.post(
  CODES_ENDPOINTS.sendEmailCodePasswordRecovery,
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequestMiddleware,
  sendPasswordRecoveryCodeController
)
