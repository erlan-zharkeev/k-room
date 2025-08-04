import { CodesEndpointsEnum } from 'common-types'
import { Router } from 'express'
import { CodesController } from 'server/src/controllers'
import { codesRequestValidator } from 'server/src/middlewares'

export const codesRouter = Router()

codesRouter.post(
  CodesEndpointsEnum.SendEmailCodePasswordRecovery,
  codesRequestValidator,
  CodesController.emailPasswordRecovery
)
codesRouter.post(
  CodesEndpointsEnum.ValidateEmailCodePasswordRecovery,
  CodesController.validateEmailCodePasswordRecovery
)
