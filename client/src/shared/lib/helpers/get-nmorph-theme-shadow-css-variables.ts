import type { IThemeShadowSettings } from 'src/shared/config'

import { getNmorphThemeShadowOptions } from './get-nmorph-theme-shadow-options'

export const getNmorphThemeShadowCssVariables = (settings: IThemeShadowSettings) => {
  const { baseShadowWidth, baseShadowBlurCoefficient } = getNmorphThemeShadowOptions(settings)

  return {
    '--base-shadow-width': baseShadowWidth,
    '--base-shadow-blur-coefficient': baseShadowBlurCoefficient
  }
}
