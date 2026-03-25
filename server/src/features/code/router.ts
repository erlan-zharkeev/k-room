import { Router } from 'express'

import { sendPasswordRecoveryCodeRouter } from './send-password-recovery-code'
import { validatePasswordRecoveryCodeRouter } from './validate-password-recovery-code'

export const codeRouter = Router()

codeRouter.use(sendPasswordRecoveryCodeRouter)
codeRouter.use(validatePasswordRecoveryCodeRouter)
