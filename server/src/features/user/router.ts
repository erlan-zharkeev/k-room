import { Router } from 'express'
import {
  getUserRouter,
  markInfoNotificationAsReadRouter,
  resetPasswordRouter,
  updateUserRouter
} from 'src/features/user'

export const userRouter = Router()

userRouter.use(getUserRouter)
userRouter.use(resetPasswordRouter)
userRouter.use(updateUserRouter)
userRouter.use(markInfoNotificationAsReadRouter)
