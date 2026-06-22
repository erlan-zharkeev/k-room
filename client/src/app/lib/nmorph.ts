import { en, ru, zh } from '@nmorph/nmorph-ui-kit'
import type { AppLanguage } from 'global-shared'

import { DEFAULT_APPEARANCE } from 'src/entities/setting'
import type { AppearanceSettings, ThemeShadowSettings } from 'src/entities/setting'

export const getNmorphThemeShadowOptions = ({ baseShadowWidth, baseShadowBlurCoefficient }: ThemeShadowSettings) => {
  return {
    baseShadowWidth: `${baseShadowWidth}px`,
    baseShadowBlurCoefficient: String(baseShadowBlurCoefficient)
  }
}

const getEffectiveThemeName = ({ selectedTheme, systemTheme }: AppearanceSettings) => {
  return selectedTheme === 'system' ? systemTheme : selectedTheme
}

export const createNmorphOptions = (
  language: AppLanguage = 'en',
  appearance: AppearanceSettings = DEFAULT_APPEARANCE
) => {
  const effectiveThemeName = getEffectiveThemeName(appearance)
  const effectiveTheme = appearance.themes[effectiveThemeName]

  return {
    theme: {
      themes: {
        dark: appearance.themes.dark.colorSchema,
        light: appearance.themes.light.colorSchema,
        custom: appearance.themes.custom.colorSchema
      },
      defaultTheme: effectiveThemeName,
      saveCurrentThemeToLS: false,
      darkShadeGeneratorCoefficient: effectiveTheme.darkShadeGeneratorCoefficient,
      lightShadeGeneratorCoefficient: effectiveTheme.lightShadeGeneratorCoefficient,
      other: getNmorphThemeShadowOptions(effectiveTheme)
    },
    i18n: {
      messages: {
        en,
        ru,
        zh
      },
      locale: language,
      outsideMessagesMerge: true
    }
  }
}
