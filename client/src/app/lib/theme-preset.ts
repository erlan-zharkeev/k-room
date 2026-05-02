import { usePreset } from '@primeuix/themes'

import { DEFAULT_APPEARANCE, type IAppearanceSettings } from 'src/shared/config'
import { createThemePreset } from 'src/shared/lib'

export const getThemePreset = (appearance: IAppearanceSettings = DEFAULT_APPEARANCE) => {
  const source = appearance.selectedTheme === 'system' ? appearance.systemTheme : appearance.selectedTheme
  const colorSchema = appearance.themes[source].colorSchema
  return createThemePreset(colorSchema)
}

export const applyThemePreset = (appearance: IAppearanceSettings) => {
  usePreset(getThemePreset(appearance))
}
