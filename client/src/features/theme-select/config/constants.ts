import type { IThemeSelectOption } from '../types'

import { THEME_SELECT_I18N } from './i18n'

export const THEME_SELECT_DEFAULT_PROPS = {
  compact: false
} as const

export const THEME_SELECT_OPTIONS: IThemeSelectOption[] = [
  {
    icon: 'pi pi-desktop',
    label: THEME_SELECT_I18N.systemTheme,
    value: 'system'
  },
  {
    icon: 'pi pi-moon',
    label: THEME_SELECT_I18N.darkTheme,
    value: 'dark'
  },
  {
    icon: 'pi pi-sun',
    label: THEME_SELECT_I18N.lightTheme,
    value: 'light'
  },
  {
    icon: 'pi pi-palette',
    label: THEME_SELECT_I18N.customTheme,
    value: 'custom'
  }
]
