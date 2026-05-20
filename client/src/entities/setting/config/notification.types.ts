export type NotificationEventGroupType = 'messages' | 'calls'

export type NotificationSettingGroupType = 'general' | NotificationEventGroupType

export type NotificationPushSettingKeyType = 'browserPush' | 'nativePush'

export type NotificationSettingKeyType = 'toast' | 'sound' | 'vibration' | NotificationPushSettingKeyType

export interface INotificationGroupSettings {
  toast: boolean
  sound: boolean
  vibration: boolean
  browserPush: boolean
  nativePush: boolean
}

export interface IDeviceNotificationSettings {
  enabled: boolean
  general: INotificationGroupSettings
  messages: INotificationGroupSettings
  calls: INotificationGroupSettings
}
