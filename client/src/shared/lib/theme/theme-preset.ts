import { usePreset } from '@primeuix/themes'

import { DARK_THEME_COLORS, LIGHT_THEME_COLORS } from 'src/shared/config/theme.constants'
import type { ThemeType } from 'src/shared/types/theme'

import { useSettings } from '../../../entities/setting'

import { createThemePreset } from './create-theme-preset'
import { mergeCustomTheme } from './merge-custom-theme'

const darkThemePreset = createThemePreset(DARK_THEME_COLORS)
const lightThemePreset = createThemePreset(LIGHT_THEME_COLORS)

export const applyThemePreset = (theme: Exclude<ThemeType, 'system'>) => {
  const { settings } = useSettings()
  let themeToApply = theme === 'light' ? lightThemePreset : darkThemePreset
  if (theme === 'custom') {
    themeToApply = createThemePreset(mergeCustomTheme(settings.value.customTheme))
  }
  usePreset(themeToApply)
  return darkThemePreset
}
