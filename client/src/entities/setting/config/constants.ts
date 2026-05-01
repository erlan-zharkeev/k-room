import { CLIENT_LANGUAGE, DEFAULT_CUSTOM_THEME } from 'src/shared/config'
import type { IUserSetting } from 'src/shared/config'

export const DEFAULT_CUSTOM_SOUNDS = {
  connection: '',
  calling: '',
  'income-message': '',
  ring: '',
  busy: ''
}

export const SYSTEM_THEME_QUERY = window.matchMedia?.('(prefers-color-scheme: light)')

export const DEFAULT_SETTINGS: IUserSetting = {
  selectedContentTab: 'contacts',
  selectedChatRoomId: '',
  messageScrollByRoom: {},
  language: CLIENT_LANGUAGE,
  theme: 'system',
  systemTheme: SYSTEM_THEME_QUERY.matches ? 'light' : 'dark',
  customTheme: DEFAULT_CUSTOM_THEME,
  soundOn: true,
  showTooltips: false,
  showNotification: true,
  showWallpaper: true,
  wallpaper: 'default',
  customWallpaperDataUrl: '',
  customWallpaperDarkness: 45,
  sound: 'income-message',
  customSounds: DEFAULT_CUSTOM_SOUNDS,
  selectedAudioInputDeviceId: '',
  selectedVideoInputDeviceId: '',
  selectedAudioOutputDeviceId: '',
  hiddenNotification: []
}
