import { usePreset } from '@primeuix/themes'

import { useSettings } from 'src/entities/setting'
import { DARK_COLOR_SCHEMA, LIGHT_COLOR_SCHEMA } from 'src/shared/config'
import { createThemePreset, mergeCustomTheme } from 'src/shared/lib'

const darkThemePreset = createThemePreset(DARK_COLOR_SCHEMA)
const lightThemePreset = createThemePreset(LIGHT_COLOR_SCHEMA)

export const getThemePreset = () => {
  const { settings, isSelectedThemeCustom, isSelectedThemeSystem } = useSettings()
  const source = isSelectedThemeSystem.value
    ? settings.value.appearance.systemTheme
    : settings.value.appearance.selectedTheme

  let themeToApply = source === 'light' ? lightThemePreset : darkThemePreset

  if (isSelectedThemeCustom.value) {
    themeToApply = createThemePreset(mergeCustomTheme(settings.value.appearance.themes.custom.colorSchema))
  }

  return themeToApply
}

export const applyThemePreset = () => {
  const preset = getThemePreset()
  usePreset(preset)
}
