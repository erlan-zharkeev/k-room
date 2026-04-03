import { InfoNotificationModel } from '../model'

export const ADMIN_INFO_NOTIFICATION_OPTIONS = {
  resource: InfoNotificationModel,
  options: {
    id: 'info-notifications',
    navigation: 'Content',
    listProperties: ['_id', 'title.ru', 'title.en', 'isActive', 'createdAt'],
    showProperties: ['_id', 'title.ru', 'title.en', 'content.ru', 'content.en', 'isActive', 'createdAt', 'updatedAt'],
    editProperties: ['title.ru', 'title.en', 'content.ru', 'content.en', 'isActive'],
    filterProperties: ['_id', 'title.ru', 'title.en', 'isActive', 'createdAt'],
    properties: {
      _id: {
        label: 'Id'
      },
      id: {
        isVisible: false
      }
    }
  }
}
