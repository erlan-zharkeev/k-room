import { Router } from 'express'
import { userRouter } from 'features/user'
import { codesRouter } from 'features/codes'

export const rootRouter = Router()

rootRouter.use(userRouter, codesRouter)
