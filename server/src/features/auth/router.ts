import { Router } from 'express'

import { confirmEmailRouter } from 'src/features/auth/confirm-email'
import { loginRouter } from 'src/features/auth/login'
import { logoutRouter } from 'src/features/auth/logout'
import { registrationRouter } from 'src/features/auth/registration'
import { sendEmailConfirmationLinkRouter } from 'src/features/auth/send-confirmation-link'
import { providerLoginRouter } from 'src/features/auth/sign-in-with-provider'
import { updateTokenPairRouter } from 'src/features/auth/update-token-pair'

export const authRouter = Router()

authRouter.use(confirmEmailRouter)
authRouter.use(loginRouter)
authRouter.use(registrationRouter)
authRouter.use(sendEmailConfirmationLinkRouter)
authRouter.use(providerLoginRouter)
authRouter.use(updateTokenPairRouter)
authRouter.use(logoutRouter)
