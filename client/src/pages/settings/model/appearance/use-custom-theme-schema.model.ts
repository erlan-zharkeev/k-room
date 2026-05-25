import { useNmorph } from '@nmorph/nmorph-ui-kit'

import { useSettings } from 'src/entities/setting'
import type { ColorSchema, ThemeShadowSettings } from 'src/entities/setting'
import { getNmorphGeneratedColorSchema } from 'src/shared/lib'

export const useCustomThemeSchema = () => {
  const { effectiveTheme, mutate, setByPath } = useSettings()
  const { theme } = useNmorph()

  const changeThemeColor = (key: keyof ColorSchema, value: string) => {
    const shouldGenerateColors = key === 'main'

    if (shouldGenerateColors) {
      theme.data.darkShadeGeneratorCoefficient = effectiveTheme.value.darkShadeGeneratorCoefficient
      theme.data.lightShadeGeneratorCoefficient = effectiveTheme.value.lightShadeGeneratorCoefficient
    }

    const generatedColorSchema = shouldGenerateColors
      ? getNmorphGeneratedColorSchema(value, theme.getDynamicColorVariables)
      : {}

    void mutate((data) => {
      const { colorSchema } = data.appearance.themes.custom

      colorSchema[key] = value
      Object.assign(colorSchema, generatedColorSchema)
    })
  }

  const changeThemeShadowSetting = (key: keyof ThemeShadowSettings, value: number) => {
    void setByPath(`appearance.themes.custom.${key}`, value)
  }

  return {
    changeThemeColor,
    changeThemeShadowSetting
  }
}
