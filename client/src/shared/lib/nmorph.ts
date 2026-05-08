import type { INmorphThemeInstance } from '@nmorph/nmorph-ui-kit'

import type { IThemeShadowSettings } from 'src/shared/config'

export const getNmorphThemeShadowOptions = ({ baseShadowWidth, baseShadowBlurCoefficient }: IThemeShadowSettings) => {
  return {
    baseShadowWidth: `${baseShadowWidth}px`,
    baseShadowBlurCoefficient: String(baseShadowBlurCoefficient)
  }
}

export const getNmorphGeneratedColorSchema = (
  mainColor: string,
  getDynamicColorVariables: INmorphThemeInstance['getDynamicColorVariables']
) => {
  const variables = getDynamicColorVariables(mainColor) ?? []
  const darkShade = variables.find(({ name }) => name === '--nmorph-dark-shade-color')?.color
  const lightShade = variables.find(({ name }) => name === '--nmorph-light-shade-color')?.color

  return darkShade && lightShade ? { darkShade, lightShade } : {}
}
