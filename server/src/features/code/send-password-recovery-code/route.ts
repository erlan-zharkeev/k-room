import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import { sendPasswordRecoveryCode } from 'src/features/code/send-password-recovery-code'
import { fieldsValidation } from 'src/features/code/send-password-recovery-code'

import { validateRequest } from 'src/shared/middleware'

export const sendPasswordRecoveryCodeRouter = Router()

sendPasswordRecoveryCodeRouter.post(
  CodesEndpointsEnum.SendEmailCodePasswordRecovery,
  fieldsValidation,
  validateRequest,
  sendPasswordRecoveryCode
)
