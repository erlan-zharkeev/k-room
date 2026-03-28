import { Router } from 'express'
import { authRouter, codeRouter, mediaRouter, userRouter } from 'src/app/router'

export const rootRouter = Router()

rootRouter.use(authRouter, codeRouter, userRouter, mediaRouter)
