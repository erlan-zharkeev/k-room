import { onBeforeUnmount, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { applyThemePreset } from 'src/shared/lib'

import { SYSTEM_THEME_QUERY } from '../../entities/setting/config/constants'

export const useThemeProvider = () => {
  const { settings, shallowUpdate } = useSettings()

  const updateSystemTheme = () => {
    const systemTheme = SYSTEM_THEME_QUERY?.matches ? 'light' : 'dark'
    shallowUpdate({ systemTheme })
  }

  watch(
    () => settings.value.theme,
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
    () => settings.value.customTheme,
    () => {
      if (settings.value.theme !== 'custom') return
      applyThemePreset()
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    SYSTEM_THEME_QUERY?.removeEventListener('change', updateSystemTheme)
  })
}
