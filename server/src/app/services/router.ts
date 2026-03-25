import { Router } from 'express'

import { authRouter } from 'features/auth'
import { codeRouter } from 'features/code'
import { mediaRouter } from 'features/media'
import { userRouter } from 'features/user'

export const rootRouter = Router()

rootRouter.use(authRouter, codeRouter, userRouter, mediaRouter)
