import { usePreset } from '@primeuix/themes'

import { DARK_THEME_COLORS, DEFAULT_CUSTOM_THEME, LIGHT_THEME_COLORS } from 'src/shared/config/theme.constants'
import type { ICustomThemeSetting, ThemeType } from 'src/shared/types/theme'

import { createThemePreset } from './create-theme-preset'
import { isSystemThemeLight } from './get-system-theme'
import { mergeCustomTheme } from './merge-custom-theme'

const darkThemePreset = createThemePreset(DARK_THEME_COLORS)
const lightThemePreset = createThemePreset(LIGHT_THEME_COLORS)

export const defaultThemePreset = isSystemThemeLight() ? lightThemePreset : darkThemePreset

export const getThemePreset = (theme: ThemeType, customTheme: ICustomThemeSetting = DEFAULT_CUSTOM_THEME) => {
  const resolvedTheme = theme === 'system' ? (isSystemThemeLight() ? 'light' : 'dark') : theme

  if (resolvedTheme === 'light') return lightThemePreset

  if (resolvedTheme === 'custom') {
    return createThemePreset(mergeCustomTheme(customTheme))
  }

  return darkThemePreset
}

export const applyThemePreset = (theme: ThemeType, customTheme: ICustomThemeSetting = DEFAULT_CUSTOM_THEME) => {
  usePreset(getThemePreset(theme, customTheme))
}
