import type { LocalizedText } from 'global-shared'

import type { NotificationSettingGroup, NotificationSettingKey } from 'src/entities/setting'
import type { ClientPlatform } from 'src/shared/lib'

export type SettingsNotificationOptionId = 'enabled' | NotificationSettingKey

export type SettingsNotificationVisibility = ClientPlatform

export interface SettingsNotificationSection {
  id: NotificationSettingGroup
  title: LocalizedText<string>
}

export interface SettingsNotificationOption {
  id: SettingsNotificationOptionId
  label: LocalizedText<string>
  description: LocalizedText<string>
  visibility?: SettingsNotificationVisibility
  mobileOnly?: boolean
}
