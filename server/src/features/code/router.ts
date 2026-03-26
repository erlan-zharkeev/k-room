import { Router } from 'express'

import { sendPasswordRecoveryCodeRouter } from 'features/code/send-password-recovery-code'
import { validatePasswordRecoveryCodeRouter } from 'features/code/validate-password-recovery-code'

export const codeRouter = Router()

codeRouter.use(sendPasswordRecoveryCodeRouter)
codeRouter.use(validatePasswordRecoveryCodeRouter)
