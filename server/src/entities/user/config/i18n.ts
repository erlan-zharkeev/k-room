import { LocalizedTextMapType } from 'common'

export const USER_ADMIN_I18N = {
  validationFailed: {
    en: 'User form contains validation errors',
    ru: 'Форма пользователя содержит ошибки валидации'
  },
  passwordRequired: {
    en: 'Password is required when creating a user from admin panel',
    ru: 'Пароль обязателен при создании пользователя из admin panel'
  }
} as const satisfies LocalizedTextMapType
