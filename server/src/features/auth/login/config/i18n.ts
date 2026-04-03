import { LocalizedTextMapType } from 'common'

export const LOGIN_I18N = {
  success: {
    en: 'Logged in successfully',
    ru: 'Вход выполнен'
  },
  emailNotConfirmed: {
    en: 'Please confirm your email. The confirmation email may have ended up in your spam folder',
    ru: 'Подтвердите email. Письмо с подтверждением могло попасть в спам'
  },
  invalidEmailOrPassword: {
    en: 'Invalid email or password',
    ru: 'Неверный email или пароль'
  },
  failed: {
    en: 'Login failed. Please try again later',
    ru: 'Не удалось выполнить вход. Попробуйте позже'
  }
} as const satisfies LocalizedTextMapType
