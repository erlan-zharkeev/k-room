import { onBeforeUnmount, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { applyThemePreset } from 'src/shared/lib'

const systemThemeQuery = window.matchMedia?.('(prefers-color-scheme: light)')

export const useThemeProvider = () => {
  const { settings, shallowUpdate } = useSettings()

  const updateSystemTheme = () => {
    const systemTheme = systemThemeQuery?.matches ? 'light' : 'dark'
    shallowUpdate({ systemTheme })
    applyThemePreset(systemTheme)
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

      applyThemePreset(theme)
    },
    { immediate: true }
  )

  watch(
    () => settings.value.customTheme,
    () => {
      if (settings.value.theme !== 'custom') return
      applyThemePreset('custom')
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    systemThemeQuery?.removeEventListener('change', updateSystemTheme)
  })
}
