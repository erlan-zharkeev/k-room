import { onBeforeUnmount, watch } from 'vue'

import { applyPrimeVueTheme, useSettings } from 'src/shared/lib'

export const useThemeProvider = () => {
  const { settings } = useSettings()
  const systemThemeQuery = window.matchMedia?.('(prefers-color-scheme: light)')

  const updateSystemTheme = () => {
    applyPrimeVueTheme('system', settings.value.customTheme)
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

      applyPrimeVueTheme(theme, settings.value.customTheme)
    },
    { immediate: true }
  )

  watch(
    () => settings.value.customTheme,
    (customTheme) => {
      if (settings.value.theme !== 'custom') return

      applyPrimeVueTheme('custom', customTheme)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    systemThemeQuery?.removeEventListener('change', updateSystemTheme)
  })
}
