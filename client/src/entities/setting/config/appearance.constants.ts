import { DEFAULT_DARK_WALLPAPER, DEFAULT_LIGHT_WALLPAPER } from 'src/shared/assets'

import type {
  EffectiveTheme,
  ColorSchema,
  ThemeData,
  ThemeShadowSettings,
  WallpaperSettings,
  SystemTheme
} from './appearance.types'

const SHARED_THEME_COLORS = {
  info: '#4592c936',
  infoText: '#4592c9',
  success: '#2ba74833',
  successText: '#2ba748',
  error: '#e84f4f49',
  errorText: '#e84f4f',
  warn: '#e6a31c3f',
  warnText: '#E6A21C',
  gray: '#c9d2dee6',
  white: '#ffffff',
  black: '#000000',
  overlay: '#00000095'
} as const

export const EFFECTIVE_THEME_VALUES = ['dark', 'light', 'custom'] as const satisfies readonly [
  EffectiveTheme,
  EffectiveTheme,
  EffectiveTheme
]

export const DEFAULT_THEME_SHADOW_SETTINGS = {
  darkShadeGeneratorCoefficient: -45,
  lightShadeGeneratorCoefficient: 45,
  baseShadowWidth: 3.5,
  baseShadowBlurCoefficient: 2
} as const satisfies ThemeShadowSettings

export const DARK_COLOR_SCHEMA = {
  main: '#1c1f21',
  darkShade: '#131415',
  lightShade: '#242728',
  text: '#778288',
  scrollThumb: '#778288',
  accent: '#006cb6',
  focusText: '#ffffff',
  placeholderText: '#68747b',
  semiContrastText: '#9caab0',
  contrastText: '#c3cdd1',
  ...SHARED_THEME_COLORS
} as const satisfies ColorSchema

export const LIGHT_COLOR_SCHEMA = {
  darkShade: '#c4c8ca',
  main: '#e9ecec',
  lightShade: '#fcfcfc',
  text: '#687b9e',
  accent: '#4a90e2',
  scrollThumb: '#687b9e',
  focusText: '#ffffff',
  placeholderText: '#9aa8b3',
  semiContrastText: '#8a9dc0',
  contrastText: '#536381',
  ...SHARED_THEME_COLORS
} as const satisfies ColorSchema

export const CUSTOM_COLOR_SCHEMA = { ...DARK_COLOR_SCHEMA } as const satisfies ColorSchema

export const DEFAULT_CUSTOM_SCHEMA = { ...DARK_COLOR_SCHEMA } as const satisfies ColorSchema
export const DEFAULT_CUSTOM_THEME_MODE = 'dark' as const satisfies SystemTheme

export const DEFAULT_WALLPAPER_SETTINGS = {
  angle: -50,
  scale: 100,
  darkness: 0,
  url: '',
  filename: ''
} as const satisfies WallpaperSettings

export const DEFAULT_DARK_WALLPAPER_URL = DEFAULT_DARK_WALLPAPER
export const DEFAULT_DARK_WALLPAPER_FILENAME = 'default-wallpaper-dark.webp'

export const DEFAULT_LIGHT_WALLPAPER_URL = DEFAULT_LIGHT_WALLPAPER
export const DEFAULT_LIGHT_WALLPAPER_FILENAME = 'default-wallpaper-light.webp'

export const DARK_WALLPAPER_SETTINGS = {
  ...DEFAULT_WALLPAPER_SETTINGS,
  url: DEFAULT_DARK_WALLPAPER_URL,
  filename: DEFAULT_DARK_WALLPAPER_FILENAME
} as const satisfies WallpaperSettings

export const LIGHT_WALLPAPER_SETTINGS = {
  ...DEFAULT_WALLPAPER_SETTINGS,
  url: DEFAULT_LIGHT_WALLPAPER_URL,
  filename: DEFAULT_LIGHT_WALLPAPER_FILENAME
} as const satisfies WallpaperSettings

export const CUSTOM_WALLPAPER_SETTINGS = {
  ...DEFAULT_WALLPAPER_SETTINGS,
  darkness: 45,
  angle: 0,
  url: '',
  filename: ''
} as const satisfies WallpaperSettings

export const APPEARANCE_DARK = {
  mode: 'dark',
  ...DEFAULT_THEME_SHADOW_SETTINGS,
  colorSchema: DARK_COLOR_SCHEMA,
  wallpaper: DARK_WALLPAPER_SETTINGS
} as const satisfies ThemeData

export const APPEARANCE_LIGHT = {
  mode: 'light',
  ...DEFAULT_THEME_SHADOW_SETTINGS,
  colorSchema: LIGHT_COLOR_SCHEMA,
  wallpaper: LIGHT_WALLPAPER_SETTINGS
} as const satisfies ThemeData

export const APPEARANCE_CUSTOM = {
  mode: DEFAULT_CUSTOM_THEME_MODE,
  ...DEFAULT_THEME_SHADOW_SETTINGS,
  colorSchema: CUSTOM_COLOR_SCHEMA,
  wallpaper: CUSTOM_WALLPAPER_SETTINGS
} as const satisfies ThemeData

export const SYSTEM_THEME_QUERY = window.matchMedia?.('(prefers-color-scheme: light)')

export const DEFAULT_APPEARANCE = {
  selectedTheme: 'system',
  systemTheme: SYSTEM_THEME_QUERY.matches ? 'light' : 'dark',
  showWallpaper: true,
  themes: {
    dark: APPEARANCE_DARK,
    light: APPEARANCE_LIGHT,
    custom: APPEARANCE_CUSTOM
  }
} as const
