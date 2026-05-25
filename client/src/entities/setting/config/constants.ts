import { DEFAULT_APPEARANCE } from './appearance.constants'
import { DEFAULT_IO_DEVICES_SETTINGS } from './io-devices.constants'
import { DEFAULT_LOCALIZATION_SETTINGS } from './localization.constants'
import { DEFAULT_NOTIFICATION_SETTINGS } from './notification.constants'
import type { DeviceSetting } from './types'

export const DEFAULT_SETTINGS: DeviceSetting = {
  contentTab: 'contacts',
  chatRoomId: '',
  contentNavigationScrollByTab: {
    'chat-rooms': {
      x: 0,
      y: 0
    },
    contacts: {
      x: 0,
      y: 0
    }
  },
  messageScrollByRoom: {},
  localization: DEFAULT_LOCALIZATION_SETTINGS,
  appearance: DEFAULT_APPEARANCE,

  notifications: DEFAULT_NOTIFICATION_SETTINGS,

  ioDevices: DEFAULT_IO_DEVICES_SETTINGS,
  hiddenNotification: []
}
