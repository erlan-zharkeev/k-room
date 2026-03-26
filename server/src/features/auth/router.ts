import { Router } from 'express'

import { confirmEmailRouter } from 'features/auth/confirm-email'
import { loginRouter } from 'features/auth/login'
import { logoutRouter } from 'features/auth/logout'
import { registrationRouter } from 'features/auth/registration'
import { sendEmailConfirmationLinkRouter } from 'features/auth/send-confirmation-link'
import { providerLoginRouter } from 'features/auth/sign-in-with-provider'
import { updateTokenPairRouter } from 'features/auth/update-token-pair'

export const authRouter = Router()

authRouter.use(confirmEmailRouter)
authRouter.use(loginRouter)
authRouter.use(registrationRouter)
authRouter.use(sendEmailConfirmationLinkRouter)
authRouter.use(providerLoginRouter)
authRouter.use(updateTokenPairRouter)
authRouter.use(logoutRouter)