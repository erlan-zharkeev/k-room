import { Router } from 'express'

import { getUserRouter } from 'src/features/user/get-user-data'
import { markInfoNotificationAsReadRouter } from 'src/features/user/mark-info-notification-as-read'
import { resetPasswordRouter } from 'src/features/user/reset-password'
import { updateUserRouter } from 'src/features/user/update-user-data'

export const userRouter = Router()

userRouter.use(getUserRouter)
userRouter.use(resetPasswordRouter)
userRouter.use(updateUserRouter)
userRouter.use(markInfoNotificationAsReadRouter)
