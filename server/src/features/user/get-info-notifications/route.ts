import { Router } from 'express'

import { USER_ENDPOINTS } from 'common'

import { accessTokenValidator } from 'src/features/auth'

import { getInfoNotificationsController } from './index'

export const getInfoNotificationsRouter = Router()

getInfoNotificationsRouter.get(
  USER_ENDPOINTS.getInfoNotifications,
  accessTokenValidator,
  getInfoNotificationsController
)
