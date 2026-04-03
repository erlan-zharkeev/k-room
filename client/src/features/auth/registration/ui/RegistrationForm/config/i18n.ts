import { LocalizedTextMapType } from 'common'

export const REGISTRATION_FORM_I18N = {
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
} as const satisfies LocalizedTextMapType
