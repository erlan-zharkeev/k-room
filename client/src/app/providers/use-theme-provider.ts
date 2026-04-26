import { onBeforeUnmount, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { applyThemePreset } from 'src/shared/lib'

export const useThemeProvider = () => {
  const { settings } = useSettings()
  const systemThemeQuery = window.matchMedia?.('(prefers-color-scheme: light)')

  const updateSystemTheme = () => {
    applyThemePreset('system', settings.value.customTheme)
  }

  watch(
    () => settings.value.theme,
    (theme, previousTheme) => {
      if (previousTheme === 'system') {
        systemThemeQuery?.removeEventListener('change', updateSystemTheme)
      }

      if (theme === 'system') {
        systemThemeQuery?.addEventListener('change', updateSystemTheme)
        updateSystemTheme()
        return
      }

      applyThemePreset(theme, settings.value.customTheme)
    },
    { immediate: true }
  )

  watch(
    () => settings.value.customTheme,
    (customTheme) => {
      if (settings.value.theme !== 'custom') return

      applyThemePreset('custom', customTheme)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    systemThemeQuery?.removeEventListener('change', updateSystemTheme)
  })
}
