import type { IUserSetting } from 'src/shared/config'
import { CLIENT_LANGUAGE } from 'src/shared/config'
import { DEFAULT_IO_DEVICES_SETTINGS } from 'src/shared/config'
import { DEFAULT_NOTIFICATION_SETTINGS } from 'src/shared/config'
import { DEFAULT_APPEARANCE } from 'src/shared/config'

export const DEFAULT_SETTINGS: IUserSetting = {
  selectedContentTab: 'contacts',
  selectedChatRoomId: '',
  messageScrollByRoom: {},
  language: CLIENT_LANGUAGE,
  appearance: DEFAULT_APPEARANCE,

  showTooltips: false,
  sound: 'income-message',
  notifications: DEFAULT_NOTIFICATION_SETTINGS,

  ioDevices: DEFAULT_IO_DEVICES_SETTINGS,
  hiddenNotification: []
}
