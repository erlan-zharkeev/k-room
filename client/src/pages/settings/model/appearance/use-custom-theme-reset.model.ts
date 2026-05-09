import { ref, watch } from 'vue'

import {
  DARK_COLOR_SCHEMA,
  DEFAULT_CUSTOM_THEME_MODE,
  DEFAULT_THEME_SHADOW_SETTINGS,
  LIGHT_COLOR_SCHEMA,
  useSettings
} from 'src/entities/setting'
import type { SystemTheme } from 'src/entities/setting'

const COLOR_SCHEMAS = {
  dark: DARK_COLOR_SCHEMA,
  light: LIGHT_COLOR_SCHEMA
} as const

export const useCustomThemeReset = () => {
  const { mutate, settings } = useSettings()
  const resetThemeMode = ref<SystemTheme>(DEFAULT_CUSTOM_THEME_MODE)

  const changeResetThemeMode = (value: string) => {
    if (value !== 'dark' && value !== 'light') return

    resetThemeMode.value = value
  }

  const resetCustomTheme = () => {
    void mutate((data) => {
      data.appearance.themes.custom.colorSchema = { ...COLOR_SCHEMAS[resetThemeMode.value] }
      data.appearance.themes.custom.mode = resetThemeMode.value
      Object.assign(data.appearance.themes.custom, DEFAULT_THEME_SHADOW_SETTINGS)
    })
  }

  watch(
    () => settings.value.appearance.themes.custom.mode,
    (value) => {
      resetThemeMode.value = value
    },
    { immediate: true }
  )

  return {
    resetThemeMode,
    changeResetThemeMode,
    resetCustomTheme
  }
}
