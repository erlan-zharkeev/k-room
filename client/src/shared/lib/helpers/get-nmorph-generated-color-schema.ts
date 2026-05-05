import type { INmorphThemeInstance } from '@nmorph/nmorph-ui-kit'

const DARK_SHADE_VARIABLE = '--nmorph-dark-shade-color'
const LIGHT_SHADE_VARIABLE = '--nmorph-light-shade-color'

export const getNmorphGeneratedColorSchema = (
  mainColor: string,
  getDynamicColorVariables: INmorphThemeInstance['getDynamicColorVariables']
) => {
  const variables = getDynamicColorVariables(mainColor) ?? []
  const darkShade = variables.find(({ name }) => name === DARK_SHADE_VARIABLE)?.color
  const lightShade = variables.find(({ name }) => name === LIGHT_SHADE_VARIABLE)?.color

  return darkShade && lightShade ? { darkShade, lightShade } : {}
}
