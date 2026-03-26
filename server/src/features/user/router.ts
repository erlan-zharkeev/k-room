import { Router } from 'express'

import { getUserRouter } from 'features/user/get-user-data'
import { markInfoNotificationAsReadRouter } from 'features/user/mark-info-notification-as-read'
import { resetPasswordRouter } from 'features/user/reset-password'
import { updateUserRouter } from 'features/user/update-user-data'

export const userRouter = Router()

userRouter.use(getUserRouter)
userRouter.use(resetPasswordRouter)
userRouter.use(updateUserRouter)
userRouter.use(markInfoNotificationAsReadRouter)
