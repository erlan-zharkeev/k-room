import { defineI18n } from 'global-shared'

export const MESSAGES_I18N = defineI18n({
  changeMessageStatusFailed: {
    en: 'Failed to update message status',
    ru: 'Не удалось обновить статус сообщения',
    zh: '更新消息状态失败'
  },
  markRoomAsReadFailed: {
    en: 'Failed to mark chat as read',
    ru: 'Не удалось отметить чат прочитанным',
    zh: '无法将聊天标为已读'
  },
  deleteMessageFailed: {
    en: 'Failed to delete message',
    ru: 'Не удалось удалить сообщение',
    zh: '删除消息失败'
  },
  updatePinnedMessageFailed: {
    en: 'Failed to update pinned message',
    ru: 'Failed to update pinned message',
    zh: 'Failed to update pinned message'
  },
  updateMessageReactionFailed: {
    en: 'Failed to update message reaction',
    ru: 'Failed to update message reaction',
    zh: 'Failed to update message reaction'
  },
  updateTypingStatusFailed: {
    en: 'Failed to update typing status',
    ru: 'Не удалось обновить статус набора',
    zh: '更新输入状态失败'
  },
  loadRoomMessagesFailed: {
    en: 'Failed to load room messages',
    ru: 'Не удалось загрузить сообщения комнаты',
    zh: '加载房间消息失败'
  },
  messageBodyTooLong: {
    en: 'Message is too long',
    ru: 'Message is too long',
    zh: 'Message is too long'
  },
  messageImageLimitReached: {
    en: 'Too many images in one message',
    ru: 'Too many images in one message',
    zh: 'Too many images in one message'
  },
  messageLoadLimitExceeded: {
    en: 'Message load limit exceeded',
    ru: 'Message load limit exceeded',
    zh: 'Message load limit exceeded'
  },
  sendMessageFailed: {
    en: 'Failed to send message',
    ru: 'Не удалось отправить сообщение',
    zh: '发送消息失败'
  }
})
