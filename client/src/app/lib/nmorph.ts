import { en, ru, zh } from '@nmorph/nmorph-ui-kit'

import type { AppLanguageType } from 'global-shared'
import { DEFAULT_APPEARANCE } from 'src/shared/config'
import type { IAppearanceSettings, IColorSchema } from 'src/shared/types/appearance.types'

import {
  DEFAULT_NMORPH_THEME_STATUS_COLORS,
  NMORPH_COLOR_SUFFIX,
  NMORPH_CSS_VARIABLE_PREFIX,
  NMORPH_DATA_THEME_ATTRIBUTE
} from '../config/constants'

const getEffectiveThemeName = ({ selectedTheme, systemTheme }: IAppearanceSettings) => {
  return selectedTheme === 'system' ? systemTheme : selectedTheme
}

const toKebabCase = (value: string) => value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

const createNmorphThemePalette = ({ mainBg, darkShadow, lightShadow, text, accent, contrastText, semiContrast }: IColorSchema) => {
  return {
    main: mainBg,
    darkShade: darkShadow,
    lightShade: lightShadow,
    text,
    accent,
    focusText: contrastText,
    placeholderText: semiContrast,
    gray: semiContrast
  }
}

const createNmorphCommonPalette = ({ semiContrast }: IColorSchema) => {
  return {
    ...DEFAULT_NMORPH_THEME_STATUS_COLORS,
    gray: semiContrast
  }
}

const createNmorphCssPalette = (colors: IColorSchema) => {
  return {
    ...createNmorphCommonPalette(colors),
    ...createNmorphThemePalette(colors)
  }
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
        common: createNmorphCommonPalette(effectiveTheme.colorSchema),
        dark: createNmorphThemePalette(appearance.themes.dark.colorSchema),
        light: createNmorphThemePalette(appearance.themes.light.colorSchema),
        custom: createNmorphThemePalette(appearance.themes.custom.colorSchema)
      },
      defaultTheme: effectiveThemeName,
      saveCurrentThemeToLS: false
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

export const syncNmorphTheme = (themeName: string, colors: IColorSchema) => {
  const rootElement = document.documentElement

  rootElement.setAttribute(NMORPH_DATA_THEME_ATTRIBUTE, themeName)

  Object.entries(createNmorphCssPalette(colors)).forEach(([name, color]) => {
    rootElement.style.setProperty(`${NMORPH_CSS_VARIABLE_PREFIX}${toKebabCase(name)}${NMORPH_COLOR_SUFFIX}`, color)
  })
}
