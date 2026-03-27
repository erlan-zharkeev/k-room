import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import { sendPasswordRecoveryCode } from 'features/code/send-password-recovery-code'
import { fieldsValidation } from 'features/code/send-password-recovery-code'

import { validateRequest } from 'shared-middleware'

export const sendPasswordRecoveryCodeRouter = Router()

sendPasswordRecoveryCodeRouter.post(
  CodesEndpointsEnum.SendEmailCodePasswordRecovery,
  fieldsValidation,
  validateRequest,
  sendPasswordRecoveryCode
)
