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

export interface IThemeData {
  colorSchema: IColorSchema
  wallpaper: IWallpaperSettings
}

export interface IColorSchema {
  mainBg: string
  widgetBg: string
  accent: string
  text: string
  secondaryText: string
  contrastText: string
  darkShadow: string
  lightShadow: string
}

export interface IAppearanceSettings {
  selectedTheme: ThemeType
  systemTheme: SystemTheme
  showWallpaper: boolean
  themes: Record<EffectiveThemeType, IThemeData>
}
