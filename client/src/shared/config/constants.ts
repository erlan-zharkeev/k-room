import { APP_LANGUAGE } from 'global-shared'

import type { ScreenBreakpointsType } from 'src/shared/types'

export const CLIENT_ENV = __CLIENT_ENV_DATA__

const BROWSER_LANGUAGE = navigator.language.toLowerCase()

export const CLIENT_LANGUAGE = BROWSER_LANGUAGE.startsWith(APP_LANGUAGE.Ru)
  ? APP_LANGUAGE.Ru
  : BROWSER_LANGUAGE.startsWith(APP_LANGUAGE.Zh)
  ? APP_LANGUAGE.Zh
  : APP_LANGUAGE.En

export const LOCAL_STORAGE_KEY = {
  LogoutStatus: 'logout-status'
} as const

export const SUCCESS_TOAST_LIFE_MS = 2000
export const ERROR_TOAST_LIFE_MS = 60000
export const SOCKET_RECONNECTION_DELAY_MS = 1000
export const SOCKET_MAX_RECONNECTION_DELAY_MS = 1000
export const API_SUCCESS_STATUS_START = 200
export const API_SUCCESS_STATUS_END = 300

export const SCREEN_BREAKPOINTS = {
  mobile: 320,
  'portrait-tablet': 768,
  tablet: 1024,
  desktop: 1920
} satisfies ScreenBreakpointsType
