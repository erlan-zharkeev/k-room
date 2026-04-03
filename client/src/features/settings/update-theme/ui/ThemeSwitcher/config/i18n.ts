import { LocalizedTextMapType } from 'common'

export const THEME_SWITCHER_I18N = {
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
