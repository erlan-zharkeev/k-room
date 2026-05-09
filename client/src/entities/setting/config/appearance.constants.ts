import { DEFAULT_DARK_WALLPAPER, DEFAULT_LIGHT_WALLPAPER } from 'src/shared/assets'

import type {
  EffectiveThemeType,
  IColorSchema,
  IThemeData,
  IThemeShadowSettings,
  IWallpaperSettings,
  SystemTheme
} from './appearance.types'

const ACCENT_COLOR = '#418fde'
const SHARED_THEME_COLORS = {
  info: '#d4e5edbb',
  infoText: '#506c80',
  success: '#67C23A',
  successText: '#0b5b1d',
  error: '#F56C6C',
  errorText: '#8d3333',
  warn: '#E6A21C',
  warnText: '#7a6712',
  white: '#ffffff',
  black: '#000000',
  overlay: '#00000095'
} as const

export const EFFECTIVE_THEME_VALUES = ['dark', 'light', 'custom'] as const satisfies readonly [
  EffectiveThemeType,
  EffectiveThemeType,
  EffectiveThemeType
]

export const DEFAULT_THEME_SHADOW_SETTINGS = {
  darkShadeGeneratorCoefficient: -45,
  lightShadeGeneratorCoefficient: 45,
  baseShadowWidth: 3.5,
  baseShadowBlurCoefficient: 2
} as const satisfies IThemeShadowSettings

export const DARK_COLOR_SCHEMA = {
  main: '#1c1f21',
  darkShade: '#0f1112',
  lightShade: '#292d30',
  text: '#778288',
  scrollThumb: '#778288',
  accent: '#006cb6',
  focusText: '#ffffff',
  placeholderText: '#575757',
  semiContrastText: '#9caab0',
  contrastText: '#c3cdd1',
  gray: '#c8d0dc',
  ...SHARED_THEME_COLORS
} as const satisfies IColorSchema

export const LIGHT_COLOR_SCHEMA = {
  darkShade: '#c8c9ca',
  main: '#e9ecec',
  lightShade: '#fdfdfd',
  text: '#687b9e',
  accent: '#4a90e2',
  scrollThumb: '#687b9e',
  focusText: '#ffffff',
  placeholderText: '#c1c9cf',
  semiContrastText: '#8a9dc0',
  contrastText: '#b4c4de',
  gray: '#656565',
  ...SHARED_THEME_COLORS
} as const satisfies IColorSchema

export const CUSTOM_COLOR_SCHEMA = {
  main: '#1c1c1c',
  darkShade: '#0e0e0e',
  lightShade: '#2a2a2a',
  text: '#9eabbc',
  accent: ACCENT_COLOR,
  scrollThumb: '#9eabbc',
  focusText: '#f4f7fb',
  placeholderText: '#c8d0dc',
  semiContrastText: '#c8d0dc',
  contrastText: '#f4f7fb',
  gray: '#c8d0dc',
  ...SHARED_THEME_COLORS
} as const satisfies IColorSchema

export const DEFAULT_CUSTOM_SCHEMA = { ...DARK_COLOR_SCHEMA } as const satisfies IColorSchema
export const DEFAULT_CUSTOM_THEME_MODE = 'dark' as const satisfies SystemTheme

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

export const APPEARANCE_DARK = {
  mode: 'dark',
  ...DEFAULT_THEME_SHADOW_SETTINGS,
  colorSchema: DARK_COLOR_SCHEMA,
  wallpaper: DARK_WALLPAPER_SETTINGS
} as const satisfies IThemeData

export const APPEARANCE_LIGHT = {
  mode: 'light',
  ...DEFAULT_THEME_SHADOW_SETTINGS,
  colorSchema: LIGHT_COLOR_SCHEMA,
  wallpaper: LIGHT_WALLPAPER_SETTINGS
} as const satisfies IThemeData

export const APPEARANCE_CUSTOM = {
  mode: DEFAULT_CUSTOM_THEME_MODE,
  ...DEFAULT_THEME_SHADOW_SETTINGS,
  colorSchema: CUSTOM_COLOR_SCHEMA,
  wallpaper: CUSTOM_WALLPAPER_SETTINGS
} as const satisfies IThemeData

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
