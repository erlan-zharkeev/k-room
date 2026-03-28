import { type LocalizedTextMapType } from 'common'

export const I18N_REGISTRATION_MESSAGE = {
  registrationSuccess: {
    en: 'Registration successful. Please check your email to confirm your account',
    ru: 'Регистрация завершена. Проверьте email и подтвердите аккаунт'
  },
  failedRegistration: {
    en: 'Registration failed. Please try again later',
    ru: 'Не удалось завершить регистрацию. Попробуйте позже'
  }
} as const satisfies LocalizedTextMapType
