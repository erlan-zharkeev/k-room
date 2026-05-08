import type { AppLanguageType } from 'global-shared'

import type { IAppearanceSettings } from './appearance.types'

export type DateTimeFormatType = 'auto' | 'dmy-dot-24h' | 'mdy-slash-12h' | 'dmy-slash-24h' | 'ymd-dash-24h'

export type DateTimeFormatPatternMapType = Partial<Record<DateTimeFormatType, string>>

export type AsideBarButtonNameType = 'contacts' | 'chat-rooms' | 'calls' | 'settings'

export type ContentTabType = 'info-notifications' | AsideBarButtonNameType

export type HiddenNotificationType = 'audio-context'

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

export interface IUserNotificationSettings {
  enabled: boolean
  general: INotificationGroupSettings
  messages: INotificationGroupSettings
  calls: INotificationGroupSettings
}

export interface IMessageListScrollState {
  firstVisibleItemId: string
  offsetFromItemStart?: number
}

export interface IIoDevicesSettings {
  audioInputDeviceId: string
  videoInputDeviceId: string
  audioOutputDeviceId: string
}

export interface IUserLocalizationSettings {
  language: AppLanguageType
  dateTimeFormat: DateTimeFormatType
}

export interface IUserSetting {
  contentTab: ContentTabType
  chatRoomId: string
  messageScrollByRoom: Record<string, IMessageListScrollState>
  localization: IUserLocalizationSettings
  appearance: IAppearanceSettings
  notifications: IUserNotificationSettings
  ioDevices: IIoDevicesSettings
  hiddenNotification: HiddenNotificationType[]
}

export type DbUserSettingType = IUserSetting
