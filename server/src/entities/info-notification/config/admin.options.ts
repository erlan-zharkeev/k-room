import { InfoNotificationModel } from '../model'

export const ADMIN_INFO_NOTIFICATION_OPTIONS = {
  resource: InfoNotificationModel,
  options: {
    id: 'info-notifications',
    navigation: 'Content',
    listProperties: ['id', 'title.ru', 'title.en', 'isActive', 'createdAt'],
    showProperties: ['id', 'title.ru', 'title.en', 'content.ru', 'content.en', 'isActive', 'createdAt', 'updatedAt'],
    editProperties: ['id', 'title.ru', 'title.en', 'content.ru', 'content.en', 'isActive'],
    filterProperties: ['id', 'title.ru', 'title.en', 'isActive', 'createdAt'],
    properties: {
      _id: {
        isVisible: false
      }
    }
  }
}
