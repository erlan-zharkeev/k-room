import { defineI18n } from 'global-shared'

export const MESSAGES_I18N = defineI18n({
  changeMessageStatusFailed: {
    en: 'Failed to update message status',
    ru: 'Не удалось обновить статус сообщения',
    zh: '更新消息状态失败'
  },
  loadRoomMessagesFailed: {
    en: 'Failed to load room messages',
    ru: 'Не удалось загрузить сообщения комнаты',
    zh: '加载房间消息失败'
  },
  sendMessageFailed: {
    en: 'Failed to send message',
    ru: 'Не удалось отправить сообщение',
    zh: '发送消息失败'
  }
})
