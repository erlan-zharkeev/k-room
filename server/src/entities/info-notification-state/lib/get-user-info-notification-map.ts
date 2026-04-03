import { Types } from 'mongoose'

import { InfoNotificationMapType } from 'common'

import { getInfoNotificationState } from './get-info-notification-state'

export const getUserInfoNotificationMap = async (userId: string | Types.ObjectId): Promise<InfoNotificationMapType> => {
  const state = await getInfoNotificationState(userId)
  const infoNotifications = state.infoNotifications

  if (!infoNotifications) return {}

  return Object.fromEntries(Object.entries(infoNotifications)) as InfoNotificationMapType
}
