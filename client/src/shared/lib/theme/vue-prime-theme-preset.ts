import { usePreset } from '@primeuix/themes'

import { DARK_THEME_COLORS, DEFAULT_CUSTOM_THEME, LIGHT_THEME_COLORS } from '../../config/theme.constants'
import { ThemeType, ICustomThemeSetting } from '../../types/theme'

import { createThemePreset } from './create-theme-preset'
import { isSystemThemeLight } from './get-system-theme'
import { mergeCustomTheme } from './merge-custom-theme'

const darkPrimeVueTheme = createThemePreset(DARK_THEME_COLORS)
const lightPrimeVueTheme = createThemePreset(LIGHT_THEME_COLORS)

export const primeVueTheme = isSystemThemeLight() ? lightPrimeVueTheme : darkPrimeVueTheme

export const getPrimeVueTheme = (theme: ThemeType, customTheme: ICustomThemeSetting = DEFAULT_CUSTOM_THEME) => {
  const resolvedTheme = theme === 'system' ? (isSystemThemeLight() ? 'light' : 'dark') : theme

  if (resolvedTheme === 'light') return lightPrimeVueTheme

  if (resolvedTheme === 'custom') {
    return createThemePreset(mergeCustomTheme(customTheme))
  }

  return darkPrimeVueTheme
}

export const applyPrimeVueTheme = (theme: ThemeType, customTheme: ICustomThemeSetting = DEFAULT_CUSTOM_THEME) => {
  usePreset(getPrimeVueTheme(theme, customTheme))
}
