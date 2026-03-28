import { type LocalizedTextMapType } from 'common'

export const AUTH_TABS_LAYOUT_I18N = {
  login: {
    en: 'Login',
    ru: 'Вход'
  },
  register: {
    en: 'Register',
    ru: 'Регистрация'
  }
} as const satisfies LocalizedTextMapType
