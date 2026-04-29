export type ThemeType = 'system' | 'dark' | 'light' | 'custom'

export type CustomThemeColorType =
  | 'mainBg'
  | 'text.contrastText'
  | 'text.semiContrastText'
  | 'text.text'
  | 'surfaceCard'
  | 'accent'
  | 'buttonSecondaryBackground'
  | 'buttonSecondaryHoverBackground'
  | 'shadowOutsetStart'
  | 'shadowOutsetEnd'
  | 'darkGrayTransparent'

export interface ICustomThemeTextSetting {
  contrastText: string
  semiContrastText: string
  text: string
}

export interface ICustomThemeSetting {
  mainBg: string
  text: ICustomThemeTextSetting
  surfaceCard: string
  accent: string
  buttonSecondaryBackground: string
  buttonSecondaryHoverBackground: string
  shadowOutsetStart: string
  shadowOutsetEnd: string
  darkGrayTransparent: string
}
