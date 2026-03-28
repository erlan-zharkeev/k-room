import { Router } from 'express'

import { authRouter } from 'src/app/router'

export const rootRouter = Router()

rootRouter.use(authRouter)
