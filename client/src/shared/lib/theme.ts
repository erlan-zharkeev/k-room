import { INmorphThemeInstance } from '@nmorph/nmorph-ui-kit'

export const getNmorphGeneratedColorSchema = (
  mainColor: string,
  getDynamicColorVariables: INmorphThemeInstance['getDynamicColorVariables']
) => {
  const variables = getDynamicColorVariables(mainColor) ?? []
  const darkShade = variables.find(({ name }) => name === '--nmorph-dark-shade-color')?.color
  const lightShade = variables.find(({ name }) => name === '--nmorph-light-shade-color')?.color

  return darkShade && lightShade ? { darkShade, lightShade } : {}
}
