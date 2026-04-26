import { APP_LANGUAGE } from 'global-shared'

import { DEFAULT_CUSTOM_THEME } from 'src/shared/config/theme.constants'
import type { IUserSetting } from 'src/shared/types/setting'

const BROWSER_LANGUAGE = navigator.language.toLowerCase()

export const CLIENT_LANGUAGE = BROWSER_LANGUAGE.startsWith(APP_LANGUAGE.Ru)
  ? APP_LANGUAGE.Ru
  : BROWSER_LANGUAGE.startsWith(APP_LANGUAGE.Zh)
  ? APP_LANGUAGE.Zh
  : APP_LANGUAGE.En

export const CLIENT_ENV = __CLIENT_ENV_DATA__

export const LOCAL_STORAGE_KEY = {
  LogoutStatus: 'logout-status'
} as const

export const ROOM_MESSAGES_PAGE_LIMIT = 30

export const API_TOAST_LIFE_MS = 4000
export const API_SUCCESS_STATUS_START = 200
export const API_SUCCESS_STATUS_END = 300

export const DEFAULT_CUSTOM_SOUNDS = {
  connection: '',
  calling: '',
  ding: '',
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
  sound: 'ding',
  customSounds: DEFAULT_CUSTOM_SOUNDS,
  selectedAudioInputDeviceId: '',
  selectedVideoInputDeviceId: '',
  selectedAudioOutputDeviceId: '',
  hiddenNotification: []
}
