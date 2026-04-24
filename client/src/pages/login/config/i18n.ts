import { defineI18n } from 'global-shared'

export const LOGIN_FORM_I18N = defineI18n({
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
  },
  failedToLogin: {
    en: 'Failed to login',
    ru: 'Не удалось войти'
  }
})
