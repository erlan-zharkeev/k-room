import type { IUserNotificationSettings } from 'src/shared/model'

export const DEFAULT_NOTIFICATION_GROUP_SETTINGS = {
  toast: true,
  sound: true,
  vibration: true,
  browserPush: true,
  nativePush: true
}

export const DEFAULT_NOTIFICATION_SETTINGS: IUserNotificationSettings = {
  enabled: true,
  general: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS },
  messages: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS },
  calls: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS }
}
