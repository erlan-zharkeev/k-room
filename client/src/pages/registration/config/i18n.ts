import { defineI18n } from 'global-shared'

export const REGISTRATION_FORM_I18N = defineI18n({
  usernamePlaceholder: {
    en: 'Username',
    ru: 'Имя пользователя',
    zh: '用户名'
  },
  passwordPlaceholder: {
    en: 'Password',
    ru: 'Пароль',
    zh: '密码'
  },
  submit: {
    en: 'Register',
    ru: 'Зарегистрироваться',
    zh: '注册'
  },
  read: {
    en: 'Read',
    ru: 'Да',
    zh: '已读'
  },
  unread: {
    en: 'Unread',
    ru: 'Нет',
    zh: '未读'
  }
})

export const PRIVACY_POLICY_SWITCH_I18N = defineI18n({
  agreement: {
    en: 'I have read and agree',
    ru: 'Я прочитал и принимаю',
    zh: '我已阅读并同意'
  },
  link: {
    en: 'legal information',
    ru: 'правовую информацию',
    zh: '法律信息'
  }
})
