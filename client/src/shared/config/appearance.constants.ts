import { DEFAULT_DARK_WALLPAPER, DEFAULT_LIGHT_WALLPAPER } from 'src/shared/assets'

import type { IColorSchema, IWallpaperSettings } from '../types/appearance.types'

const ACCENT_COLOR = '#418fde'

export const DARK_COLOR_SCHEMA = {
  mainBg: '#1c1c1c',
  cardSurface: '#1c1c1c',
  accent: ACCENT_COLOR,
  text: '#9eabbc',
  secondaryText: '#c8d0dc',
  contrastText: '#f4f7fb',
  darkShadow: '#0f0f0f',
  lightShadow: '#626262'
} as const satisfies IColorSchema

export const LIGHT_COLOR_SCHEMA = {
  mainBg: '#cfcfcf',
  cardSurface: '#1c1c1c',
  accent: ACCENT_COLOR,
  text: '#6f6f6f',
  secondaryText: '#656565',
  contrastText: '#000000',
  darkShadow: '#b6b6b6',
  lightShadow: '#e8e8e8'
} as const satisfies IColorSchema

export const CUSTOM_COLOR_SCHEMA = {
  mainBg: '#1c1c1c',
  cardSurface: '#1c1c1c',
  accent: ACCENT_COLOR,
  text: '#9eabbc',
  secondaryText: '#c8d0dc',
  contrastText: '#f4f7fb',
  darkShadow: '#0f0f0f',
  lightShadow: '#626262'
} as const satisfies IColorSchema

export const DEFAULT_CUSTOM_SCHEMA = DARK_COLOR_SCHEMA

export const DEFAULT_WALLPAPER_SETTINGS = {
  angle: -50,
  scale: 100,
  darkness: 0,
  url: '',
  filename: ''
} as const satisfies IWallpaperSettings

export const DEFAULT_DARK_WALLPAPER_URL = DEFAULT_DARK_WALLPAPER
export const DEFAULT_DARK_WALLPAPER_FILENAME = 'default-wallpaper-dark.jpeg'

export const DEFAULT_LIGHT_WALLPAPER_URL = DEFAULT_LIGHT_WALLPAPER
export const DEFAULT_LIGHT_WALLPAPER_FILENAME = 'default-wallpaper-light.png'

export const DARK_WALLPAPER_SETTINGS = {
  ...DEFAULT_WALLPAPER_SETTINGS,
  url: DEFAULT_DARK_WALLPAPER_URL,
  filename: DEFAULT_DARK_WALLPAPER_FILENAME
} as const satisfies IWallpaperSettings

export const LIGHT_WALLPAPER_SETTINGS = {
  ...DEFAULT_WALLPAPER_SETTINGS,
  url: DEFAULT_LIGHT_WALLPAPER_URL,
  filename: DEFAULT_LIGHT_WALLPAPER_FILENAME
} as const satisfies IWallpaperSettings

export const CUSTOM_WALLPAPER_SETTINGS = {
  ...DEFAULT_WALLPAPER_SETTINGS,
  darkness: 45,
  angle: 0,
  url: '',
  filename: ''
} as const satisfies IWallpaperSettings

export const APPEARANCE_DARK = { colorSchema: DARK_COLOR_SCHEMA, wallpaper: DARK_WALLPAPER_SETTINGS } as const
export const APPEARANCE_LIGHT = { colorSchema: LIGHT_COLOR_SCHEMA, wallpaper: LIGHT_WALLPAPER_SETTINGS } as const
export const APPEARANCE_CUSTOM = { colorSchema: CUSTOM_COLOR_SCHEMA, wallpaper: CUSTOM_WALLPAPER_SETTINGS } as const

export const SYSTEM_THEME_QUERY = window.matchMedia?.('(prefers-color-scheme: light)')

export const DEFAULT_APPEARANCE = {
  selectedTheme: 'system',
  systemTheme: SYSTEM_THEME_QUERY.matches ? 'light' : 'dark',
  themes: {
    dark: APPEARANCE_DARK,
    light: APPEARANCE_LIGHT,
    custom: APPEARANCE_CUSTOM
  }
} as const
