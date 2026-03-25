import { type LocalizedTextType } from 'common-types'

export const MESSAGE = {
  success: {
    en: 'Logged in successfully',
    ru: 'Вход выполнен'
  } satisfies LocalizedTextType,
  emailNotConfirmed: {
    en: 'Please confirm your email. The confirmation email may have ended up in your spam folder',
    ru: 'Подтвердите email. Письмо с подтверждением могло попасть в спам'
  } satisfies LocalizedTextType,
  invalidEmailOrPassword: {
    en: 'Invalid email or password',
    ru: 'Неверный email или пароль'
  } satisfies LocalizedTextType,
  failed: {
    en: 'Login failed. Please try again later',
    ru: 'Не удалось выполнить вход. Попробуйте позже'
  } satisfies LocalizedTextType
}
