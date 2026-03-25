import { type LocalizedTextMapType } from 'common'

export const THEME_SWITCHER_TEXT = {
  label: {
    en: 'Theme',
    ru: 'Тема'
  },
  dark: {
    en: 'Dark',
    ru: 'Тёмн.'
  },
  light: {
    en: 'Light',
    ru: 'Свет.'
  }
} as const satisfies LocalizedTextMapType
