export type ThemeType = 'system' | 'dark' | 'light' | 'custom'

export type SystemTheme = Extract<ThemeType, 'dark' | 'light'>

export type EffectiveThemeType = Exclude<ThemeType, 'system'>

export interface IWallpaperSettings {
  angle: number
  scale: number
  darkness: number
  url: string
  filename: string
}

export interface IThemeShadowSettings {
  darkShadeGeneratorCoefficient: number
  lightShadeGeneratorCoefficient: number
  baseShadowWidth: number
  baseShadowBlurCoefficient: number
}

export interface IColorSchema {
  main: string
  darkShade: string
  lightShade: string
  text: string
  accent: string
  focusText: string
  placeholderText: string
  semiContrastText: string
  contrastText: string
  info: string
  infoText: string
  success: string
  successText: string
  error: string
  errorText: string
  warn: string
  warnText: string
  gray: string
  scrollThumb: string
  white: string
  black: string
  overlay: string
}

export interface IThemeData extends IThemeShadowSettings {
  mode: SystemTheme
  colorSchema: IColorSchema
  wallpaper: IWallpaperSettings
}

export interface IAppearanceSettings {
  selectedTheme: ThemeType
  systemTheme: SystemTheme
  showWallpaper: boolean
  themes: Record<EffectiveThemeType, IThemeData>
}
