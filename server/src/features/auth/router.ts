import { Router } from 'express'

import { confirmEmailRouter } from './confirm-email'
import { loginRouter } from './login'
import { logoutRouter } from './logout'
import { registrationRouter } from './registration'
import { sendEmailConfirmationLinkRouter } from './send-confirmation-link'
import { providerLoginRouter } from './sign-in-with-provider'
import { updateTokenPairRouter } from './update-token-pair'

export const authRouter = Router()

authRouter.use(confirmEmailRouter)
authRouter.use(loginRouter)
authRouter.use(registrationRouter)
authRouter.use(sendEmailConfirmationLinkRouter)
authRouter.use(providerLoginRouter)
authRouter.use(updateTokenPairRouter)
authRouter.use(logoutRouter)