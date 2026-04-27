import { CLIENT_LANGUAGE, DEFAULT_CUSTOM_THEME } from 'src/shared/config'
import type { IUserSetting } from 'src/shared/config'

export const DEFAULT_CUSTOM_SOUNDS = {
  connection: '',
  calling: '',
  'income-message': '',
  ring: '',
  busy: ''
}

export const DEFAULT_SETTINGS: IUserSetting = {
  selectedContentTab: 'contacts',
  selectedChatRoomId: '',
  messageScrollByRoom: {},
  language: CLIENT_LANGUAGE,
  theme: 'system',
  customTheme: DEFAULT_CUSTOM_THEME,
  soundOn: true,
  showTooltips: false,
  showNotification: true,
  showWallpaper: true,
  wallpaper: 'default',
  customWallpaperDataUrl: '',
  sound: 'income-message',
  customSounds: DEFAULT_CUSTOM_SOUNDS,
  selectedAudioInputDeviceId: '',
  selectedVideoInputDeviceId: '',
  selectedAudioOutputDeviceId: '',
  hiddenNotification: []
}
