import type { IThemeShadowSettings } from 'src/shared/config'

export const getNmorphThemeShadowOptions = ({ baseShadowWidth, baseShadowBlurCoefficient }: IThemeShadowSettings) => {
  return {
    baseShadowWidth: `${baseShadowWidth}px`,
    baseShadowBlurCoefficient: String(baseShadowBlurCoefficient)
  }
}
