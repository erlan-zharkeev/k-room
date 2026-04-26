import { ICustomThemeSetting } from '../types/theme'

export const PRIMARY_PALETTE = {
  500: '#418fde'
}

export const DARK_THEME_COLORS: ICustomThemeSetting = {
  mainBg: '#1c1c1c',
  text: {
    contrastText: '#f4f7fb',
    semiContrastText: '#c8d0dc',
    text: '#9eabbc'
  },
  surfaceCard: '#1c1c1c',
  accent: PRIMARY_PALETTE[500],
  shadowOutsetStart: '#0f0f0f',
  shadowOutsetEnd: '#292929',
  darkGrayTransparent: '#252525'
}

export const LIGHT_THEME_COLORS: ICustomThemeSetting = {
  mainBg: '#cfcfcf',
  text: {
    contrastText: '#000000',
    semiContrastText: '#656565',
    text: '#6f6f6f'
  },
  surfaceCard: '#f2f2f2',
  accent: PRIMARY_PALETTE[500],
  shadowOutsetStart: '#b6b6b6',
  shadowOutsetEnd: '#e8e8e8',
  darkGrayTransparent: '#cacaca'
}

export const DEFAULT_CUSTOM_THEME = DARK_THEME_COLORS
