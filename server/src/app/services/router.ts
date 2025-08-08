import { Router } from 'express'
import { authRouter } from 'features/auth'
import { userRouter } from 'features/user'

export const rootRouter = Router()

rootRouter.use(authRouter, userRouter)
