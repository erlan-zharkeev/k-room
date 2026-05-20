import type { IAppearanceSettings } from './appearance.types'
import type { ContentTabType } from './content.types'
import type { HiddenNotificationType } from './hidden-notification.types'
import type { IIoDevicesSettings } from './io-devices.types'
import type { IDeviceLocalizationSettings } from './localization.types'
import type { IMessageListScrollState } from './message.types'
import type { IDeviceNotificationSettings } from './notification.types'

export interface IDeviceSetting {
  contentTab: ContentTabType
  chatRoomId: string
  messageScrollByRoom: Record<string, IMessageListScrollState>
  localization: IDeviceLocalizationSettings
  appearance: IAppearanceSettings
  notifications: IDeviceNotificationSettings
  ioDevices: IIoDevicesSettings
  hiddenNotification: HiddenNotificationType[]
}

export type DbDeviceSettingType = IDeviceSetting
