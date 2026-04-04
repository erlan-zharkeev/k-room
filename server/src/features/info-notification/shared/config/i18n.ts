import { LocalizedTextMapType } from 'common'

export const INFO_NOTIFICATION_SHARED_I18N = {
  notFound: {
    en: 'Info notification not found',
    ru: 'Инфо уведомление не найдено'
  },
  markAsReadFailed: {
    en: 'Failed to mark info notification as read',
    ru: 'Не удалось отметить информационное уведомление как прочитанное'
  }
} as const satisfies LocalizedTextMapType
