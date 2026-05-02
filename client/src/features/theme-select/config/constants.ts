import { NmorphIconMagicStick, NmorphIconMonitor, NmorphIconMoon, NmorphIconSunny } from '@nmorph/nmorph-ui-kit'
import type { Component } from 'vue'

import type { IThemeSelectOption } from '../types'

import { THEME_SELECT_I18N } from './i18n'

export const THEME_SELECT_DEFAULT_PROPS = {
  compact: false
} as const

export const THEME_SELECT_OPTIONS: IThemeSelectOption[] = [
  {
    icon: NmorphIconMonitor as unknown as Component,
    label: THEME_SELECT_I18N.systemTheme,
    value: 'system'
  },
  {
    icon: NmorphIconMoon as unknown as Component,
    label: THEME_SELECT_I18N.darkTheme,
    value: 'dark'
  },
  {
    icon: NmorphIconSunny as unknown as Component,
    label: THEME_SELECT_I18N.lightTheme,
    value: 'light'
  },
  {
    icon: NmorphIconMagicStick as unknown as Component,
    label: THEME_SELECT_I18N.customTheme,
    value: 'custom'
  }
]
