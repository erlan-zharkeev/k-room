import { type LocalizedTextMapType } from 'common'

export const AUTH_TABS_LAYOUT_TEXT = {
  login: {
    en: 'Login',
    ru: 'Вход'
  },
  register: {
    en: 'Register',
    ru: 'Регистрация'
  }
} as const satisfies LocalizedTextMapType
