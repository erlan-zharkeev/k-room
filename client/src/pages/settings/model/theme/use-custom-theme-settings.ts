import { useSettings } from 'src/entities/setting'
import { DEFAULT_CUSTOM_SCHEMA, DEFAULT_CUSTOM_THEME_MODE, DEFAULT_THEME_SHADOW_SETTINGS } from 'src/shared/config'
import type { SystemTheme } from 'src/shared/config'

export const useCustomThemeSettings = () => {
  const { isSelectedThemeCustom, mutate, settings, setByPath } = useSettings()

  const resetCustomTheme = () => {
    void mutate((data) => {
      Object.assign(data.appearance.themes.custom, DEFAULT_THEME_SHADOW_SETTINGS)
      data.appearance.themes.custom.colorSchema = { ...DEFAULT_CUSTOM_SCHEMA }
      data.appearance.themes.custom.mode = DEFAULT_CUSTOM_THEME_MODE
    })
  }

  const changeCustomThemeMode = (value: SystemTheme) => {
    if (value === settings.value.appearance.themes.custom.mode) return

    void setByPath('appearance.themes.custom.mode', value)
  }

  return {
    isSelectedThemeCustom,
    settings,
    changeCustomThemeMode,
    resetCustomTheme
  }
}
