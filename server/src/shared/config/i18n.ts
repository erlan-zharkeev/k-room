import { type LocalizedTextMapType } from 'common'

export const SHARED_I18N = {
  success: {
    en: 'Success',
    ru: 'Успешно'
  },
  commonServerError: {
    en: 'Server error. The operation could not be performed. Please try again later',
    ru: 'Ошибка сервера. Операцию не удалось выполнить. Пожалуйста, попробуйте позже'
  },
  error: {
    en: 'Error',
    ru: 'Ошибка'
  },
  warn: {
    en: 'Warning',
    ru: 'Предупреждение'
  },
  info: {
    en: 'Info',
    ru: 'Информация'
  }
} as const satisfies LocalizedTextMapType
