import { InfoNotificationMapType } from 'common'

export const getUserInfoNotificationIds = (infoNotifications?: InfoNotificationMapType) => Object.keys(infoNotifications ?? {})
