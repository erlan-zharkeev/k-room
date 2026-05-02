import { useNmorph } from '@nmorph/nmorph-ui-kit'
import { onBeforeUnmount, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useThemeSelect } from 'src/features/theme-select'
import { SYSTEM_THEME_QUERY } from 'src/shared/config'

import { syncNmorphTheme } from '../lib/nmorph'

export const useThemeProvider = () => {
  const { settings, isSelectedThemeSystem, effectiveTheme } = useSettings()
  const { changeSystemTheme } = useThemeSelect()
  const { theme: nmorphTheme } = useNmorph()

  const applyAppearanceTheme = () => {
    const activeTheme = settings.value.appearance.selectedTheme === 'system'
      ? settings.value.appearance.systemTheme
      : settings.value.appearance.selectedTheme

    nmorphTheme.setTheme(activeTheme)
    syncNmorphTheme(activeTheme, settings.value.appearance.themes[activeTheme].colorSchema)
  }

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

      applyAppearanceTheme()
    },
    { immediate: true }
  )

  watch(
    () => settings.value.appearance.systemTheme,
    () => {
      if (isSelectedThemeSystem.value) {
        applyAppearanceTheme()
      }
    }
  )

  watch(
    () => effectiveTheme.value.colorSchema,
    () => {
      applyAppearanceTheme()
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    SYSTEM_THEME_QUERY?.removeEventListener('change', updateSystemTheme)
  })
}
