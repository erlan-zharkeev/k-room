import type { LocalizedText } from 'global-shared'

import type { NotificationSettingGroup, NotificationSettingKey } from 'src/entities/setting'
import type { ClientPlatform } from 'src/shared/lib'

export type SettingsNotificationOptionId = 'enabled' | NotificationSettingKey

export interface SettingsNotificationSection {
  id: NotificationSettingGroup
  title: LocalizedText<string>
}

export interface SettingsNotificationOption {
  id: SettingsNotificationOptionId
  label: LocalizedText<string>
  description: LocalizedText<string>
  visibility?: ClientPlatform
  mobileOnly?: boolean
}
