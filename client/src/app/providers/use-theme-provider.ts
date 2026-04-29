import { onBeforeUnmount, watch } from 'vue'

import { useSettings } from 'src/entities/setting'

import { applyThemePreset } from '../lib/theme-preset'

const systemThemeQuery = window.matchMedia?.('(prefers-color-scheme: light)')

export const useThemeProvider = () => {
  const { settings, shallowUpdate } = useSettings()

  const updateSystemTheme = () => {
    const systemTheme = systemThemeQuery?.matches ? 'light' : 'dark'
    shallowUpdate({ systemTheme })
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
    systemThemeQuery?.removeEventListener('change', updateSystemTheme)
  })
}
