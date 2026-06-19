import { defineI18n } from 'src/shared/lib'

export const REGISTRATION_FORM_I18N = defineI18n('registrationForm', {
  nicknamePlaceholder: {
    en: 'Enter nickname',
    ru: 'Введите никнейм',
    zh: '输入昵称'
  },
  emailPlaceholder: {
    en: 'Enter email',
    ru: 'Введите email',
    zh: '输入 email'
  },
  passwordPlaceholder: {
    en: 'Create password',
    ru: 'Придумайте пароль',
    zh: '创建密码'
  },
  submit: {
    en: 'Register',
    ru: 'Зарегистрироваться',
    zh: '注册'
  },
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
