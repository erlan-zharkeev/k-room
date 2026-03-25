import { Router } from 'express'

import { CodesEndpointsEnum } from 'common'

import { validateRequest } from 'shared-middleware'

import { sendPasswordRecoveryCode } from './controller'
import { fieldsValidation } from './lib'

export const sendPasswordRecoveryCodeRouter = Router()

sendPasswordRecoveryCodeRouter.post(
  CodesEndpointsEnum.SendEmailCodePasswordRecovery,
  fieldsValidation,
  validateRequest,
  sendPasswordRecoveryCode
)
