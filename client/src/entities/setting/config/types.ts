import type { IAppearanceSettings } from './appearance.types'
import type { ContentTabType } from './content.types'
import type { HiddenNotificationType } from './hidden-notification.types'
import type { IIoDevicesSettings } from './io-devices.types'
import type { IUserLocalizationSettings } from './localization.types'
import type { IMessageListScrollState } from './message.types'
import type { IUserNotificationSettings } from './notification.types'

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
