import { Router } from 'express'
import { authRouter } from 'src/features/auth'
import { codeRouter } from 'src/features/code'
import { mediaRouter } from 'src/features/media'
import { userRouter } from 'src/features/user'

export const rootRouter = Router()

rootRouter.use(authRouter, codeRouter, userRouter, mediaRouter)
