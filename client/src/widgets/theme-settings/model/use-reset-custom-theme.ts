import { ref, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import {
  DARK_COLOR_SCHEMA,
  DEFAULT_CUSTOM_THEME_MODE,
  DEFAULT_THEME_SHADOW_SETTINGS,
  LIGHT_COLOR_SCHEMA
} from 'src/shared/config'
import type { SystemTheme } from 'src/shared/config'

const COLOR_SCHEMAS = {
  dark: DARK_COLOR_SCHEMA,
  light: LIGHT_COLOR_SCHEMA
} as const

export const useResetCustomTheme = () => {
  const { mutate, settings } = useSettings()
  const resetTheme = ref<SystemTheme>(DEFAULT_CUSTOM_THEME_MODE)

  const changeResetTheme = (value: string) => {
    if (value !== 'dark' && value !== 'light') return

    resetTheme.value = value
  }

  const resetCustomTheme = () => {
    void mutate((data) => {
      data.appearance.themes.custom.colorSchema = { ...COLOR_SCHEMAS[resetTheme.value] }
      data.appearance.themes.custom.mode = resetTheme.value
      Object.assign(data.appearance.themes.custom, DEFAULT_THEME_SHADOW_SETTINGS)
    })
  }

  watch(
    () => settings.value.appearance.themes.custom.mode,
    (value) => {
      resetTheme.value = value
    },
    { immediate: true }
  )

  return {
    resetTheme,
    changeResetTheme,
    resetCustomTheme
  }
}
