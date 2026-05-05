import { useNmorph } from '@nmorph/nmorph-ui-kit'

import { useSettings } from 'src/entities/setting'
import type { IColorSchema, IThemeData, IThemeShadowSettings } from 'src/shared/config'
import { getNmorphGeneratedColorSchema } from 'src/shared/lib'

export const useChangeColorSchema = () => {
  const { mutate, settings } = useSettings()
  const { theme } = useNmorph()

  const getActiveTheme = () => {
    const { selectedTheme, systemTheme } = settings.value.appearance

    return selectedTheme === 'system' ? systemTheme : selectedTheme
  }

  const applyShadeGeneratorSettings = ({
    darkShadeGeneratorCoefficient,
    lightShadeGeneratorCoefficient
  }: IThemeData) => {
    theme.data.darkShadeGeneratorCoefficient = darkShadeGeneratorCoefficient
    theme.data.lightShadeGeneratorCoefficient = lightShadeGeneratorCoefficient
  }

  const changeThemeColor = (key: keyof IColorSchema, value: string) => {
    const activeThemeName = getActiveTheme()
    const activeTheme = settings.value.appearance.themes[activeThemeName]
    const canGenerateShades = activeThemeName === 'custom'

    if (canGenerateShades) {
      applyShadeGeneratorSettings(activeTheme)
    }

    const generatedColorSchema =
      canGenerateShades && key === 'main' ? getNmorphGeneratedColorSchema(value, theme.getDynamicColorVariables) : {}

    void mutate((data) => {
      const { colorSchema } = data.appearance.themes[activeThemeName]

      colorSchema[key] = value
      Object.assign(colorSchema, generatedColorSchema)
    })
  }

  const changeThemeShadowSetting = (key: keyof IThemeShadowSettings, value: number) => {
    const activeThemeName = getActiveTheme()
    if (activeThemeName !== 'custom') return

    void mutate((data) => {
      const themeData = data.appearance.themes[activeThemeName]

      themeData[key] = value

      if (key === 'darkShadeGeneratorCoefficient' || key === 'lightShadeGeneratorCoefficient') {
        applyShadeGeneratorSettings(themeData)
        Object.assign(
          themeData.colorSchema,
          getNmorphGeneratedColorSchema(themeData.colorSchema.main, theme.getDynamicColorVariables)
        )
      }
    })
  }

  return {
    changeThemeColor,
    changeThemeShadowSetting
  }
}
