import { LocalizedTextMapType } from 'common'

export const INFO_NOTIFICATION_ADMIN_I18N = {
  publishGuard: {
    en: 'Publish this info notification to all users?',
    ru: 'Опубликовать это информационное уведомление для всех пользователей?'
  },
  recordNotFound: {
    en: 'Info notification record was not found',
    ru: 'Запись информационного уведомления не найдена'
  },
  publishedRecordNotFound: {
    en: 'Published info notification record was not found after update',
    ru: 'После публикации запись информационного уведомления не найдена'
  },
  published: {
    en: 'Info notification published',
    ru: 'Информационное уведомление опубликовано'
  }
} as const satisfies LocalizedTextMapType
