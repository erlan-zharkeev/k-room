import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import { sendPasswordRecoveryCode } from 'src/features/code/send-password-recovery-code'
import { SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION } from 'src/features/code/send-password-recovery-code'

import { validateRequest } from 'src/shared/middleware'

export const sendPasswordRecoveryCodeRouter = Router()

sendPasswordRecoveryCodeRouter.post(
  CodesEndpointsEnum.SendEmailCodePasswordRecovery,
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  sendPasswordRecoveryCode
)
