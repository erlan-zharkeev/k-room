import { defineI18n } from 'src/shared/lib'

export const LOGIN_FORM_I18N = defineI18n('loginForm', {
  loginPlaceholder: {
    en: 'Enter email or nickname',
    ru: 'Введите email или никнейм',
    zh: '输入 email 或昵称'
  },
  passwordPlaceholder: {
    en: 'Enter your password',
    ru: 'Введите пароль',
    zh: '输入密码'
  },
  submit: {
    en: 'Login',
    ru: 'Войти',
    zh: '登录'
  },
  withGoogle: {
    en: 'Login with Google',
    ru: 'Войти через Google',
    zh: '使用 Google 登录'
  },
  forgotPassword: {
    en: 'Forgot password?',
    ru: 'Забыли пароль?',
    zh: '忘记密码？'
  },
  failedToLogin: {
    en: 'Failed to login',
    ru: 'Не удалось войти',
    zh: '登录失败'
  }
})
