import { Router } from 'express'

import { sendPasswordRecoveryCodeRouter } from 'src/features/code/send-password-recovery-code'
import { validatePasswordRecoveryCodeRouter } from 'src/features/code/validate-password-recovery-code'

export const codeRouter = Router()

codeRouter.use(sendPasswordRecoveryCodeRouter)
codeRouter.use(validatePasswordRecoveryCodeRouter)
