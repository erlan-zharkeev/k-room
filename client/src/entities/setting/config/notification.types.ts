export type NotificationEventGroup = 'messages' | 'calls'

export type NotificationSettingGroup = 'general' | NotificationEventGroup

export type NotificationPushSettingKey = 'browserPush' | 'nativePush'

export type NotificationSettingKey = 'toast' | 'sound' | 'vibration' | NotificationPushSettingKey

export interface NotificationGroupSettings {
  toast: boolean
  sound: boolean
  vibration: boolean
  browserPush: boolean
  nativePush: boolean
}

export interface DeviceNotificationSettings {
  enabled: boolean
  general: NotificationGroupSettings
  messages: NotificationGroupSettings
  calls: NotificationGroupSettings
}
