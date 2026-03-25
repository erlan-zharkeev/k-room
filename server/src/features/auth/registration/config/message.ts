import { type LocalizedTextType } from 'common-types'

export const MESSAGE = {
  registrationSuccess: {
    en: 'Registration successful. Please check your email to confirm your account',
    ru: 'Регистрация завершена. Проверьте email и подтвердите аккаунт'
  } satisfies LocalizedTextType,
  failedRegistration: {
    en: 'Registration failed. Please try again later',
    ru: 'Не удалось завершить регистрацию. Попробуйте позже'
  } satisfies LocalizedTextType
}
