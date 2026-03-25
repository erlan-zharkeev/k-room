import { type LocalizedTextMapType } from 'common'

export const LOGIN_FORM_TEXT = {
  emailPlaceholder: {
    en: 'Enter your email',
    ru: 'Введите email'
  },
  passwordPlaceholder: {
    en: 'Enter your password',
    ru: 'Введите пароль'
  },
  submit: {
    en: 'Login',
    ru: 'Войти'
  },
  withGoogle: {
    en: 'Login with Google',
    ru: 'Войти через Google'
  },
  forgotPassword: {
    en: 'Forgot password?',
    ru: 'Забыли пароль?'
  }
} as const satisfies LocalizedTextMapType
