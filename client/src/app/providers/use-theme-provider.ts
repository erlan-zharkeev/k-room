import { useNmorph } from '@nmorph/nmorph-ui-kit'
import { onBeforeUnmount, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useThemeSelect } from 'src/features/theme-select'
import { SYSTEM_THEME_QUERY } from 'src/shared/config'
import {
  getNmorphColorVariableName,
  getNmorphGeneratedColorSchema,
  getNmorphThemeShadowCssVariables
} from 'src/shared/lib'

export const useThemeProvider = () => {
  const { settings } = useSettings()
  const { changeSystemTheme } = useThemeSelect()
  const { theme: nmorphTheme } = useNmorph()

  const getActiveTheme = () => {
    const activeTheme =
      settings.value.appearance.selectedTheme === 'system'
        ? settings.value.appearance.systemTheme
        : settings.value.appearance.selectedTheme

    return activeTheme
  }

  const applyAppearanceTheme = () => {
    const activeTheme = getActiveTheme()
    const theme = settings.value.appearance.themes[activeTheme]
    const { colorSchema } = theme

    nmorphTheme.data.darkShadeGeneratorCoefficient = theme.darkShadeGeneratorCoefficient
    nmorphTheme.data.lightShadeGeneratorCoefficient = theme.lightShadeGeneratorCoefficient

    const generatedColorSchema =
      activeTheme === 'custom'
        ? getNmorphGeneratedColorSchema(colorSchema.main, nmorphTheme.getDynamicColorVariables)
        : {}

    nmorphTheme.setTheme(activeTheme)

    Object.entries({ ...colorSchema, ...generatedColorSchema }).forEach(([key, color]) => {
      document.documentElement.style.setProperty(getNmorphColorVariableName(key), color)
    })

    Object.entries(getNmorphThemeShadowCssVariables(theme)).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
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
    },
    { immediate: true }
  )

  watch(() => settings.value.appearance, applyAppearanceTheme, { immediate: true, deep: true })

  onBeforeUnmount(() => {
    SYSTEM_THEME_QUERY?.removeEventListener('change', updateSystemTheme)
  })
}
