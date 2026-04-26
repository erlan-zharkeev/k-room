import { defineI18n } from 'global-shared'

export const INFO_NOTIFICATION_SHARED_I18N = defineI18n({
  notFound: {
    en: 'Info notification not found',
    ru: 'Инфо уведомление не найдено',
    zh: '信息通知未找到'
  },
  markAsReadFailed: {
    en: 'Failed to mark info notification as read',
    ru: 'Не удалось отметить информационное уведомление как прочитанное',
    zh: '无法将信息通知标记为已读'
  }
})

export const INFO_NOTIFICATION_ADMIN_I18N = defineI18n({
  publishGuard: {
    en: 'Publish this info notification to all users?',
    ru: 'Опубликовать это информационное уведомление для всех пользователей?',
    zh: '将此信息通知发布给所有用户？'
  },
  recordNotFound: {
    en: 'Info notification record was not found',
    ru: 'Запись информационного уведомления не найдена',
    zh: '信息通知记录未找到'
  },
  publishedRecordNotFound: {
    en: 'Published info notification record was not found after update',
    ru: 'После публикации запись информационного уведомления не найдена',
    zh: '发布后未找到信息通知记录'
  },
  published: {
    en: 'Info notification published',
    ru: 'Информационное уведомление опубликовано',
    zh: '信息通知已发布'
  }
})

export const INFO_NOTIFICATION_STATE_I18N = defineI18n({
  stateNotFound: {
    en: 'Info notification state was not found',
    ru: 'Состояние информационных уведомлений не найдено',
    zh: '信息通知状态未找到'
  }
})
