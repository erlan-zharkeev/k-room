import { onBeforeUnmount, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useThemeSelect } from 'src/features/theme-select'
import { SYSTEM_THEME_QUERY } from 'src/shared/config'

import { applyThemePreset } from '../lib/theme-preset'

export const useThemeProvider = () => {
  const { settings, isSelectedThemeCustom } = useSettings()
  const { changeSystemTheme } = useThemeSelect()

  const updateSystemTheme = () => {
    const systemTheme = SYSTEM_THEME_QUERY?.matches ? 'light' : 'dark'
    changeSystemTheme(systemTheme)
  }

  watch(
    () => settings.value.appearance.selectedTheme,
    (theme, previousTheme) => {
      if (previousTheme === 'system') {
        SYSTEM_THEME_QUERY?.removeEventListener('change', updateSystemTheme)
      }

      if (theme === 'system') {
        SYSTEM_THEME_QUERY?.addEventListener('change', updateSystemTheme)
        updateSystemTheme()
      }

      applyThemePreset()
    },
    { immediate: true }
  )

  watch(
    () => settings.value.appearance.themes.custom,
    () => {
      if (isSelectedThemeCustom.value) applyThemePreset()
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    SYSTEM_THEME_QUERY?.removeEventListener('change', updateSystemTheme)
  })
}
