import { THEME_SETTINGS_I18N } from './i18n'

export const THEME_SETTINGS_OPTIONS = [
  {
    label: THEME_SETTINGS_I18N.systemTheme,
    value: 'system'
  },
  {
    label: THEME_SETTINGS_I18N.darkTheme,
    value: 'dark'
  },
  {
    label: THEME_SETTINGS_I18N.lightTheme,
    value: 'light'
  },
  {
    label: THEME_SETTINGS_I18N.customTheme,
    value: 'custom'
  }
] as const

export const THEME_SETTINGS_COLOR_ITEMS = [
  {
    id: 'mainBg',
    label: THEME_SETTINGS_I18N.mainBg
  },
  {
    id: 'surfaceCard',
    label: THEME_SETTINGS_I18N.surfaceCard
  },
  {
    id: 'accent',
    label: THEME_SETTINGS_I18N.accent
  },
  {
    id: 'text.contrastText',
    label: THEME_SETTINGS_I18N.contrastText
  },
  {
    id: 'text.semiContrastText',
    label: THEME_SETTINGS_I18N.semiContrastText
  },
  {
    id: 'text.text',
    label: THEME_SETTINGS_I18N.text
  },
  {
    id: 'shadowOutsetStart',
    label: THEME_SETTINGS_I18N.shadowOutsetStart
  },
  {
    id: 'shadowOutsetEnd',
    label: THEME_SETTINGS_I18N.shadowOutsetEnd
  },
  {
    id: 'darkGrayTransparent',
    label: THEME_SETTINGS_I18N.darkGrayTransparent
  }
] as const
