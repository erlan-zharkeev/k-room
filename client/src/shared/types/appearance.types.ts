export type ThemeType = 'system' | 'dark' | 'light' | 'custom'

export type WallpaperFitType = 'cover' | 'contain' | 'repeat'

export type SystemTheme = Extract<ThemeType, 'dark' | 'light'>

export type EffectiveThemeType = Exclude<ThemeType, 'system'>

export interface IWallpaperSettings {
  show: boolean
  fit: WallpaperFitType
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
  cardSurface: string
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
  themes: Record<EffectiveThemeType, IThemeData>
}
