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

export const AUTH_LAYOUT_NET_EFFECT_COLOR_CSS_VARIABLE = '--nmorph-placeholder-text-color'

export const AUTH_LAYOUT_CSS_HEX_COLOR_RADIX = 16

export const AUTH_LAYOUT_NET_EFFECT_POINT_SPEED_MULTIPLIER = 0.32

export const AUTH_LAYOUT_NET_EFFECT_OPTIONS = {
  backgroundAlpha: 0,
  forceAnimate: false,
  gyroControls: false,
  maxDistance: 25,
  minHeight: 100,
  minWidth: 100,
  mouseControls: false,
  points: 10,
  scale: 0.5,
  scaleMobile: 1.45,
  showDots: true,
  spacing: 15,
  touchControls: false
} as const
