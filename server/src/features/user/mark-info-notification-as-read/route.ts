import { UserEndpointsEnum } from 'common-types'
import { Router } from 'express'
import { accessTokenValidator } from 'features/auth'

import { markInfoAsRead } from './controller'

export const markInfoNotificationAsReadRouter = Router()

markInfoNotificationAsReadRouter.patch(
  UserEndpointsEnum.MarkInfoNotificationAsRead,
  accessTokenValidator,
  markInfoAsRead
)
