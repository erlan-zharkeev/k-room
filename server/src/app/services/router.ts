import { Router } from 'express'
import { authRouter } from 'features/auth'
import { mediaRouter } from 'features/media'
import { userRouter } from 'features/user'

export const rootRouter = Router()

rootRouter.use(authRouter, userRouter, mediaRouter)
