import type { NotificationSettingGroup, NotificationSettingKey } from 'src/entities/setting'
import type { ClientPlatform, I18nKey } from 'src/shared/lib'

export type SettingsNotificationOptionId = 'enabled' | NotificationSettingKey

export interface SettingsNotificationSection {
  id: NotificationSettingGroup
  title: I18nKey
}

export interface SettingsNotificationOption {
  id: SettingsNotificationOptionId
  label: I18nKey
  description: I18nKey
  visibility?: ClientPlatform
  mobileOnly?: boolean
}
