import type { AppearanceSettings } from './appearance.types'
import type { ContentTab } from './content.types'
import type { HiddenNotification } from './hidden-notification.types'
import type { IoDevicesSettings } from './io-devices.types'
import type { DeviceLocalizationSettings } from './localization.types'
import type { MessageListScrollState } from './message.types'
import type { DeviceNotificationSettings } from './notification.types'

export interface DeviceSetting {
  contentTab: ContentTab
  chatRoomId: string
  messageScrollByRoom: Record<string, MessageListScrollState>
  localization: DeviceLocalizationSettings
  appearance: AppearanceSettings
  notifications: DeviceNotificationSettings
  ioDevices: IoDevicesSettings
  hiddenNotification: HiddenNotification[]
}

export type DbDeviceSetting = DeviceSetting
