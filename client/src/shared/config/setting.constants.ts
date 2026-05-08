import type { IIoDevicesSettings, IUserNotificationSettings } from './setting.types'

export const DEFAULT_NOTIFICATION_GROUP_SETTINGS = {
  toast: true,
  sound: true,
  vibration: true,
  browserPush: true,
  nativePush: true
}

export const DEFAULT_NOTIFICATION_SETTINGS: IUserNotificationSettings = {
  enabled: true,
  general: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS },
  messages: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS },
  calls: { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS }
}

export const DEFAULT_IO_DEVICES_SETTINGS: IIoDevicesSettings = {
  audioInputDeviceId: '',
  videoInputDeviceId: '',
  audioOutputDeviceId: ''
}
