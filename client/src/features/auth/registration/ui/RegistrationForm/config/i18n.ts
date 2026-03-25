import { type LocalizedTextType } from 'common-types'

export const REGISTRATION_FORM_TEXT = {
  usernamePlaceholder: {
    en: 'Username',
    ru: 'Имя пользователя'
  },
  emailPlaceholder: {
    en: 'Email',
    ru: 'Email'
  },
  passwordPlaceholder: {
    en: 'Password',
    ru: 'Пароль'
  },
  submit: {
    en: 'Register',
    ru: 'Зарегистрироваться'
  },
  read: {
    en: 'Read',
    ru: 'Да'
  },
  unread: {
    en: 'Unread',
    ru: 'Нет'
  }
} as const satisfies Record<string, LocalizedTextType>
