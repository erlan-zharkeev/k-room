import { useNmorph } from '@nmorph/nmorph-ui-kit'
import { onBeforeUnmount, watch } from 'vue'

import { SYSTEM_THEME_QUERY, useSettings } from 'src/entities/setting'
import { useThemeSelect } from 'src/features/theme-select'

import { getNmorphThemeShadowOptions } from '../lib/nmorph'

export const useThemeProvider = () => {
  const { effectiveTheme, settings, isSelectedThemeSystem } = useSettings()
  const { changeSystemTheme } = useThemeSelect()
  const { theme: nmorphTheme } = useNmorph()

  const applyAppearanceTheme = (themeName: string, theme = effectiveTheme.value) => {
    const { colorSchema } = theme

    nmorphTheme.data.darkShadeGeneratorCoefficient = theme.darkShadeGeneratorCoefficient
    nmorphTheme.data.lightShadeGeneratorCoefficient = theme.lightShadeGeneratorCoefficient
    nmorphTheme.data.other = getNmorphThemeShadowOptions(theme)
    nmorphTheme.applyTheme(themeName, colorSchema)
  }

  const updateSystemTheme = () => {
    const systemTheme = SYSTEM_THEME_QUERY?.matches ? 'light' : 'dark'
    changeSystemTheme(systemTheme)

    if (isSelectedThemeSystem.value) {
      applyAppearanceTheme(systemTheme, settings.value.appearance.themes[systemTheme])
    }
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
    },
    { immediate: true }
  )

  watch(
    () => [settings.value.appearance.selectedTheme, settings.value.appearance.themes],
    () => {
      const { selectedTheme, systemTheme } = settings.value.appearance

      applyAppearanceTheme(selectedTheme === 'system' ? systemTheme : selectedTheme)
    },
    {
      immediate: true,
      deep: true
    }
  )

  onBeforeUnmount(() => {
    SYSTEM_THEME_QUERY?.removeEventListener('change', updateSystemTheme)
  })
}
