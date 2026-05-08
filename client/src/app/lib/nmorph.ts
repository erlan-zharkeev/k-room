import { en, ru, zh } from '@nmorph/nmorph-ui-kit'
import type { AppLanguageType } from 'global-shared'

import { DEFAULT_APPEARANCE } from 'src/shared/config'
import type { IAppearanceSettings } from 'src/shared/config'
import { getNmorphThemeShadowOptions } from 'src/shared/lib'

const getEffectiveThemeName = ({ selectedTheme, systemTheme }: IAppearanceSettings) => {
  return selectedTheme === 'system' ? systemTheme : selectedTheme
}

export const createNmorphOptions = (
  language: AppLanguageType = 'en',
  appearance: IAppearanceSettings = DEFAULT_APPEARANCE
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
      locale: language
    }
  }
}
