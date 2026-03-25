import { type LocalizedTextType } from 'common-types'

export const AUTH_TABS_LAYOUT_TEXT = {
  login: {
    en: 'Login',
    ru: 'Вход'
  },
  register: {
    en: 'Register',
    ru: 'Регистрация'
  }
} as const satisfies Record<string, LocalizedTextType>
