import { Router } from 'express'

import { CODES_ENDPOINTS } from 'common'

import { validateRequest } from 'src/shared/middleware'

import { SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION, sendPasswordRecoveryCodeController } from './index'

export const sendPasswordRecoveryCodeRouter = Router()

sendPasswordRecoveryCodeRouter.post(
  CODES_ENDPOINTS.sendEmailCodePasswordRecovery,
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  sendPasswordRecoveryCodeController
)
