import { defineI18n } from 'global-shared'

export const INFO_NOTIFICATION_SHARED_I18N = defineI18n({
  notFound: {
    en: 'Info notification not found',
    ru: 'Инфо уведомление не найдено'
  },
  markAsReadFailed: {
    en: 'Failed to mark info notification as read',
    ru: 'Не удалось отметить информационное уведомление как прочитанное'
  }
})

export const INFO_NOTIFICATION_ADMIN_I18N = defineI18n({
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
})

export const INFO_NOTIFICATION_STATE_I18N = defineI18n({
  stateNotFound: {
    en: 'Info notification state was not found',
    ru: 'Состояние информационных уведомлений не найдено'
  }
})
