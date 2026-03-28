import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import { SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION, sendPasswordRecoveryCodeController } from '.'

import { validateRequest } from 'src/shared/middleware'

export const sendPasswordRecoveryCodeRouter = Router()

sendPasswordRecoveryCodeRouter.post(
  CodesEndpointsEnum.SendEmailCodePasswordRecovery,
  SEND_PASSWORD_RECOVERY_CODE_FIELDS_VALIDATION,
  validateRequest,
  sendPasswordRecoveryCodeController
)
