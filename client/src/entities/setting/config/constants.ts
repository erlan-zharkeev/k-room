import {
  DEFAULT_APPEARANCE,
  DEFAULT_IO_DEVICES_SETTINGS,
  DEFAULT_LOCALIZATION_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  type IUserSetting
} from 'src/shared/config'

export const DEFAULT_SETTINGS: IUserSetting = {
  contentTab: 'contacts',
  chatRoomId: '',
  messageScrollByRoom: {},
  localization: DEFAULT_LOCALIZATION_SETTINGS,
  appearance: DEFAULT_APPEARANCE,

  notifications: DEFAULT_NOTIFICATION_SETTINGS,

  ioDevices: DEFAULT_IO_DEVICES_SETTINGS,
  hiddenNotification: []
}
