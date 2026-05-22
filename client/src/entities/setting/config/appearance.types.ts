export type Theme = 'system' | 'dark' | 'light' | 'custom'

export type SystemTheme = Extract<Theme, 'dark' | 'light'>

export type EffectiveTheme = Exclude<Theme, 'system'>

export interface WallpaperSettings {
  angle: number
  scale: number
  darkness: number
  url: string
  filename: string
}

export interface ThemeShadowSettings {
  darkShadeGeneratorCoefficient: number
  lightShadeGeneratorCoefficient: number
  baseShadowWidth: number
  baseShadowBlurCoefficient: number
}

export interface ColorSchema {
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

export interface ThemeData extends ThemeShadowSettings {
  mode: SystemTheme
  colorSchema: ColorSchema
  wallpaper: WallpaperSettings
}

export interface AppearanceSettings {
  selectedTheme: Theme
  systemTheme: SystemTheme
  showWallpaper: boolean
  themes: Record<EffectiveTheme, ThemeData>
}
