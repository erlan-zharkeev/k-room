import type { AppearanceSettings } from './appearance.types'
import type { ContentTab } from './content.types'
import type { HiddenNotification } from './hidden-notification.types'
import type { IoDevicesSettings } from './io-devices.types'
import type { DeviceLocalizationSettings } from './localization.types'
import type { DeviceNotificationSettings } from './notification.types'
import type { RoomCallSettings } from './room-call.types'

export type ScrollContentNavigationTab = Extract<ContentTab, 'chat-rooms' | 'contacts'>
export type ScrollContentNavigationByTab = Record<ScrollContentNavigationTab, number>

export interface MessageScrollBottomState {
  mode: 'bottom'
}

export interface MessageScrollAnchorState {
  mode: 'anchor'
  messageId: string
  offset: number
}

export type MessageScrollState = MessageScrollBottomState | MessageScrollAnchorState
export type MessageScrollByRoom = Record<string, MessageScrollState>

export interface DeviceSetting {
  contentTab: ContentTab
  chatRoomId: string
  settingsContentId: string
  scrollContentNavigationByTab: ScrollContentNavigationByTab
  messageScrollByRoom: MessageScrollByRoom
  quickReactions: string[]
  localization: DeviceLocalizationSettings
  appearance: AppearanceSettings
  notifications: DeviceNotificationSettings
  ioDevices: IoDevicesSettings
  roomCalls: RoomCallSettings
  hiddenNotification: HiddenNotification[]
}
