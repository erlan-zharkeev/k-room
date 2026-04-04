import { AppLanguageType, InfoNotificationMapType } from 'common'

import type { MongoIdType } from 'src/shared/config'

import { getInfoNotificationState } from './get-info-notification-state'

export const getUserInfoNotificationMap = async (
  userId: MongoIdType,
  language: AppLanguageType
): Promise<InfoNotificationMapType> => {
  const state = await getInfoNotificationState(userId, language)
  const infoNotifications = state.infoNotifications

  if (!infoNotifications) return {}

  return Object.fromEntries(Object.entries(infoNotifications))
}
