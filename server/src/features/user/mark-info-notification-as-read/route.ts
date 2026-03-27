import { Router } from 'express'

import { UserEndpointsEnum } from 'common'

import { accessTokenValidator } from 'features/auth'
import { markInfoAsRead } from 'features/user/mark-info-notification-as-read'

export const markInfoNotificationAsReadRouter = Router()

markInfoNotificationAsReadRouter.patch(
  UserEndpointsEnum.MarkInfoNotificationAsRead,
  accessTokenValidator,
  markInfoAsRead
)
