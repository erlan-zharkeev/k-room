import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import { validateRequest } from 'src/shared/middleware'

import { SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION, sendPasswordRecoveryCodeController } from '.'

export const sendPasswordRecoveryCodeRouter = Router()

sendPasswordRecoveryCodeRouter.post(
  CodesEndpointsEnum.SendEmailCodePasswordRecovery,
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  sendPasswordRecoveryCodeController
)
