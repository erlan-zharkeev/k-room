import { ROUTE_NAMES } from 'global-shared'

import { AUTH_LAYOUT_I18N } from './i18n'

export const AUTH_LAYOUT_TABS = [
  {
    label: AUTH_LAYOUT_I18N.login,
    path: ROUTE_NAMES.authLogin
  },
  {
    label: AUTH_LAYOUT_I18N.registration,
    path: ROUTE_NAMES.authRegistration
  }
] as const

export const AUTH_LAYOUT_SIGNAL_WAVE_COUNT = 7

export const AUTH_LAYOUT_SIGNAL_LINK_COUNT = 5

export const AUTH_LAYOUT_VOICE_WAVE_COUNT = 4

export const AUTH_LAYOUT_LENS_GHOST_COUNT = 4

export const AUTH_LAYOUT_VOICE_WAVE_BAR_ITEMS = [0, 1, 2, 3, 4, 5, 6, 7] as const

export const AUTH_LAYOUT_SIGNAL_LEFT_PERCENT_RANGE = [6, 94] as const

export const AUTH_LAYOUT_SIGNAL_TOP_PERCENT_RANGE = [12, 88] as const

export const AUTH_LAYOUT_SIGNAL_WAVE_SIZE_PX_RANGE = [180, 520] as const

export const AUTH_LAYOUT_SIGNAL_WAVE_DELAY_SECONDS_RANGE = [-6.4, 0] as const

export const AUTH_LAYOUT_SIGNAL_WAVE_DURATION_SECONDS_RANGE = [7.6, 11.2] as const

export const AUTH_LAYOUT_SIGNAL_LINK_WIDTH_PERCENT_RANGE = [18, 62] as const

export const AUTH_LAYOUT_SIGNAL_LINK_ROTATE_DEGREE_RANGE = [-32, 32] as const

export const AUTH_LAYOUT_SIGNAL_LINK_DELAY_SECONDS_RANGE = [-4.8, 0] as const

export const AUTH_LAYOUT_SIGNAL_LINK_DURATION_SECONDS_RANGE = [4.2, 6.8] as const

export const AUTH_LAYOUT_VOICE_WAVE_LEFT_PERCENT_RANGE = [12, 88] as const

export const AUTH_LAYOUT_VOICE_WAVE_TOP_PERCENT_RANGE = [16, 84] as const

export const AUTH_LAYOUT_VOICE_WAVE_WIDTH_PX_RANGE = [96, 172] as const

export const AUTH_LAYOUT_VOICE_WAVE_APPEAR_DELAY_SECONDS_RANGE = [-8, 0] as const

export const AUTH_LAYOUT_VOICE_WAVE_APPEAR_DURATION_SECONDS_RANGE = [5.4, 9.2] as const

export const AUTH_LAYOUT_VOICE_WAVE_BAR_DELAY_SECONDS_RANGE = [-1.4, 0] as const

export const AUTH_LAYOUT_VOICE_WAVE_BAR_DURATION_SECONDS_RANGE = [1.45, 2.25] as const

export const AUTH_LAYOUT_LENS_GHOST_LEFT_PERCENT_RANGE = [8, 92] as const

export const AUTH_LAYOUT_LENS_GHOST_TOP_PERCENT_RANGE = [10, 90] as const

export const AUTH_LAYOUT_LENS_GHOST_SIZE_PX_RANGE = [44, 96] as const

export const AUTH_LAYOUT_LENS_GHOST_DELAY_SECONDS_RANGE = [-24, 0] as const

export const AUTH_LAYOUT_LENS_GHOST_DURATION_SECONDS_RANGE = [28, 44] as const

export const AUTH_LAYOUT_LENS_GHOST_DRIFT_X_PX_RANGE = [-42, 42] as const

export const AUTH_LAYOUT_LENS_GHOST_DRIFT_Y_PX_RANGE = [-32, 32] as const

export const AUTH_LAYOUT_LENS_GHOST_ROTATE_DEGREE_RANGE = [-28, 28] as const
