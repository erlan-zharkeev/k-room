import { Router } from 'express'
import {
  confirmEmailRouter,
  loginRouter,
  logoutRouter,
  providerLoginRouter,
  registrationRouter,
  sendEmailConfirmationLinkRouter,
  updateTokenPairRouter
} from 'src/features/auth'

export const authRouter = Router()

authRouter.use(confirmEmailRouter)
authRouter.use(loginRouter)
authRouter.use(registrationRouter)
authRouter.use(sendEmailConfirmationLinkRouter)
authRouter.use(providerLoginRouter)
authRouter.use(updateTokenPairRouter)
authRouter.use(logoutRouter)
