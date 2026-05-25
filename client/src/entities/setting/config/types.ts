import type { AppearanceSettings } from './appearance.types'
import type { ContentTab } from './content.types'
import type { HiddenNotification } from './hidden-notification.types'
import type { IoDevicesSettings } from './io-devices.types'
import type { DeviceLocalizationSettings } from './localization.types'
import type { DeviceNotificationSettings } from './notification.types'

export type ContentNavigationScrollTab = Extract<ContentTab, 'chat-rooms' | 'contacts'>
export type ContentNavigationScrollByTab = Record<ContentNavigationScrollTab, number>

export interface DeviceSetting {
  contentTab: ContentTab
  chatRoomId: string
  contentNavigationScrollByTab: ContentNavigationScrollByTab
  messageScrollByRoom: Record<string, number>
  localization: DeviceLocalizationSettings
  appearance: AppearanceSettings
  notifications: DeviceNotificationSettings
  ioDevices: IoDevicesSettings
  hiddenNotification: HiddenNotification[]
}

export type DbDeviceSetting = DeviceSetting
