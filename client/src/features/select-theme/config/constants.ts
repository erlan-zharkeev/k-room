import { NmorphIconMagicStick, NmorphIconMonitor, NmorphIconMoon, NmorphIconSunny } from '@nmorph/nmorph-ui-kit'

import { SELECT_THEME_I18N } from './i18n'
import type { SelectThemeOption } from './types'

export const SELECT_THEME_DEFAULT_PROPS = {
  compact: false
} as const

export const SELECT_THEME_OPTIONS: SelectThemeOption[] = [
  {
    icon: NmorphIconMonitor,
    label: SELECT_THEME_I18N.systemTheme,
    value: 'system'
  },
  {
    icon: NmorphIconMoon,
    label: SELECT_THEME_I18N.darkTheme,
    value: 'dark'
  },
  {
    icon: NmorphIconSunny,
    label: SELECT_THEME_I18N.lightTheme,
    value: 'light'
  },
  {
    icon: NmorphIconMagicStick,
    label: SELECT_THEME_I18N.customTheme,
    value: 'custom'
  }
]
