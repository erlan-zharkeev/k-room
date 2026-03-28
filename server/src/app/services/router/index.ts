import { Router } from 'express'

import { authRouter } from './auth'
import { codeRouter } from './code'
import { mediaRouter } from './media'
import { userRouter } from './user'

export const rootRouter = Router()

rootRouter.use(authRouter, codeRouter, userRouter, mediaRouter)
