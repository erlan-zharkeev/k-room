import { type LocalizedTextMapType } from 'common'

export const SHARED_MESSAGE = {
  success: {
    en: 'Success',
    ru: 'Успешно'
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
