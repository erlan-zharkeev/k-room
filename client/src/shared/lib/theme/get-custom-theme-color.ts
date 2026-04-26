import { ICustomThemeSetting, CustomThemeColorType } from '../../types/theme'

export const getCustomThemeColor = (customTheme: ICustomThemeSetting, colorName: CustomThemeColorType) => {
  if (colorName === 'text.contrastText') return customTheme.text.contrastText
  if (colorName === 'text.semiContrastText') return customTheme.text.semiContrastText
  if (colorName === 'text.text') return customTheme.text.text

  return customTheme[colorName]
}
