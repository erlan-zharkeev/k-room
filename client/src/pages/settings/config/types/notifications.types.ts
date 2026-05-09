import type { LocalizedTextType } from 'global-shared'

import type { NotificationSettingGroupType, NotificationSettingKeyType } from 'src/entities/setting'
import type { ClientPlatformType } from 'src/shared/lib'

export type SettingsNotificationOptionIdType = 'enabled' | NotificationSettingKeyType

export type SettingsNotificationVisibilityType = ClientPlatformType

export interface ISettingsNotificationSection {
  id: NotificationSettingGroupType
  title: LocalizedTextType<string>
}

export interface ISettingsNotificationOption {
  id: SettingsNotificationOptionIdType
  label: LocalizedTextType<string>
  description: LocalizedTextType<string>
  visibility?: SettingsNotificationVisibilityType
  mobileOnly?: boolean
}
