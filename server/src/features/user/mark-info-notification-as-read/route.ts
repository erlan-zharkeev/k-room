import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { accessTokenValidator } from 'src/features/auth'
import { markInfoAsRead } from 'src/features/user/mark-info-notification-as-read'

export const markInfoNotificationAsReadRouter = Router()

markInfoNotificationAsReadRouter.patch(
  UserEndpointsEnum.MarkInfoNotificationAsRead,
  accessTokenValidator,
  markInfoAsRead
)
