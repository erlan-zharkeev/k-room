import type { DeviceNotificationSettings } from './notification.types'

export const DEFAULT_NOTIFICATION_GROUP_SETTINGS = {
  toast: true,
  sound: true,
  vibration: true,
  browserPush: true,
  nativePush: true
}

export const DEFAULT_NOTIFICATION_SETTINGS: DeviceNotificationSettings = {
  enabled: true,
  general: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS },
  messages: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS },
  calls: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS },
  groupCalls: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS, sound: false, vibration: false },
  invites: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS }
}
