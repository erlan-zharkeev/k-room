import { DEFAULT_EMOJI_PICKER_QUICK_LIST } from 'src/shared/lib'

import { DEFAULT_APPEARANCE } from './appearance.constants'
import { DEFAULT_IO_DEVICES_SETTINGS } from './io-devices.constants'
import { DEFAULT_LOCALIZATION_SETTINGS } from './localization.constants'
import { DEFAULT_NOTIFICATION_SETTINGS } from './notification.constants'
import type { DeviceSetting } from './types'

export const DEFAULT_SETTINGS: DeviceSetting = {
  contentTab: 'contacts',
  chatRoomId: '',
  contentNavigationScrollByTab: {
    'chat-rooms': 0,
    contacts: 0
  },
  messageScrollByRoom: {},
  quickReactions: DEFAULT_EMOJI_PICKER_QUICK_LIST,
  localization: DEFAULT_LOCALIZATION_SETTINGS,
  appearance: DEFAULT_APPEARANCE,

  notifications: DEFAULT_NOTIFICATION_SETTINGS,

  ioDevices: DEFAULT_IO_DEVICES_SETTINGS,
  hiddenNotification: []
}
