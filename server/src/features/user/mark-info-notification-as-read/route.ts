import { Router } from 'express'

import { USER_ENDPOINTS } from 'common'

import { accessTokenValidator } from 'src/features/auth'

import { markInfoAsReadController } from './index'

export const markInfoNotificationAsReadRouter = Router()

markInfoNotificationAsReadRouter.patch(
  USER_ENDPOINTS.markInfoNotificationAsRead,
  accessTokenValidator,
  markInfoAsReadController
)
