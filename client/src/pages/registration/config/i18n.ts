import { defineI18n } from 'global-shared'

export const REGISTRATION_FORM_I18N = defineI18n({
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
})

export const PRIVACY_POLICY_SWITCH_I18N = defineI18n({
  agreement: {
    en: 'I have read and agree',
    ru: 'Я прочитал и принимаю'
  },
  link: {
    en: 'legal information',
    ru: 'правовую информацию'
  }
})
