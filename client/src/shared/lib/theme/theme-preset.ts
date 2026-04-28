import { usePreset } from '@primeuix/themes'

import { DARK_THEME_COLORS, LIGHT_THEME_COLORS } from 'src/shared/config/theme.constants'

import { useSettings } from '../../../entities/setting'

import { createThemePreset } from './create-theme-preset'
import { mergeCustomTheme } from './merge-custom-theme'

const darkThemePreset = createThemePreset(DARK_THEME_COLORS)
const lightThemePreset = createThemePreset(LIGHT_THEME_COLORS)

export const getThemePreset = () => {
  const { settings } = useSettings()
  const source = settings.value.theme === 'system' ? settings.value.systemTheme : settings.value.theme
  let themeToApply = source === 'light' ? lightThemePreset : darkThemePreset
  if (settings.value.theme === 'custom') {
    themeToApply = createThemePreset(mergeCustomTheme(settings.value.customTheme))
  }
  return themeToApply
}

export const applyThemePreset = () => {
  usePreset(getThemePreset())
}
