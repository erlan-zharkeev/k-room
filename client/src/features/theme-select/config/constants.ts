import { NmorphIconMagicStick, NmorphIconMonitor, NmorphIconMoon, NmorphIconSunny } from '@nmorph/nmorph-ui-kit'

import { THEME_SELECT_I18N } from './i18n'
import type { ThemeSelectOption } from './types'

export const THEME_SELECT_DEFAULT_PROPS = {
  compact: false
} as const

export const THEME_SELECT_OPTIONS: ThemeSelectOption[] = [
  {
    icon: NmorphIconMonitor,
    label: THEME_SELECT_I18N.systemTheme,
    value: 'system'
  },
  {
    icon: NmorphIconMoon,
    label: THEME_SELECT_I18N.darkTheme,
    value: 'dark'
  },
  {
    icon: NmorphIconSunny,
    label: THEME_SELECT_I18N.lightTheme,
    value: 'light'
  },
  {
    icon: NmorphIconMagicStick,
    label: THEME_SELECT_I18N.customTheme,
    value: 'custom'
  }
]
