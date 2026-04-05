import { defineI18n } from 'common'

export const MESSAGE_I18N = defineI18n({
  changeMessageStatusFailed: {
    en: 'Failed to update message status',
    ru: 'Не удалось обновить статус сообщения'
  },
  loadRoomMessagesFailed: {
    en: 'Failed to load room messages',
    ru: 'Не удалось загрузить сообщения комнаты'
  },
  sendMessageFailed: {
    en: 'Failed to send message',
    ru: 'Не удалось отправить сообщение'
  }
})
