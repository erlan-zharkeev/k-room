import { Router } from 'express'

import { getUserRouter } from './get-user-data'
import { markInfoNotificationAsReadRouter } from './mark-info-notification-as-read'
import { resetPasswordRouter } from './reset-password'
import { updateUserRouter } from './update-user-data'

export const userRouter = Router()

userRouter.use(getUserRouter)
userRouter.use(resetPasswordRouter)
userRouter.use(updateUserRouter)
userRouter.use(markInfoNotificationAsReadRouter)
