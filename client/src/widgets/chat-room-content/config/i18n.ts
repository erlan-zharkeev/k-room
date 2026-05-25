import { defineI18n } from 'global-shared'

export const CHAT_ROOM_CONTENT_I18N = defineI18n({
  noRoomSelected: {
    en: 'Select a chat to start messaging',
    ru: 'Выберите чат, чтобы начать переписку',
    zh: '选择一个聊天开始发送消息'
  },
  noMessages: {
    en: 'No messages yet',
    ru: 'Сообщений пока нет',
    zh: '暂无消息'
  },
  loadingMessages: {
    en: 'Loading messages',
    ru: 'Загрузка сообщений',
    zh: '正在加载消息'
  },
  loadOlderMessages: {
    en: 'Load older messages',
    ru: 'Загрузить предыдущие сообщения',
    zh: '加载更早的消息'
  },
  messageActions: {
    en: 'Message actions',
    ru: 'Действия сообщения',
    zh: '消息操作'
  },
  copyMessageText: {
    en: 'Copy text',
    ru: 'Скопировать текст',
    zh: '复制文本'
  },
  messageTextCopied: {
    en: 'Message text copied',
    ru: 'Текст сообщения скопирован',
    zh: '消息文本已复制'
  },
  deleteMessage: {
    en: 'Delete message',
    ru: 'Удалить сообщение',
    zh: '删除消息'
  },
  deleteMessageTitle: {
    en: 'Delete message',
    ru: 'Удалить сообщение',
    zh: '删除消息'
  },
  deleteMessageConfirm: {
    en: 'Choose how to delete this message. This action cannot be undone.',
    ru: 'Выберите, как удалить это сообщение. Это действие нельзя отменить.',
    zh: '选择如何删除此消息。此操作无法撤销。'
  },
  deleteMessageForMe: {
    en: 'For me',
    ru: 'У себя',
    zh: '仅自己'
  },
  deleteMessageForEveryone: {
    en: 'For everyone',
    ru: 'У всех',
    zh: '所有人'
  },
  cancel: {
    en: 'Cancel',
    ru: 'Отмена',
    zh: '取消'
  },
  messagePlaceholder: {
    en: 'Message',
    ru: 'Сообщение',
    zh: '消息'
  },
  attachFile: {
    en: 'Attach file',
    ru: 'Прикрепить файл',
    zh: '添加附件'
  },
  selectEmoji: {
    en: 'Select emoji',
    ru: 'Выбрать эмодзи',
    zh: '选择表情'
  },
  sendMessage: {
    en: 'Send message',
    ru: 'Отправить сообщение',
    zh: '发送消息'
  },
  membersQuantity: {
    en: (quantity: number) => `${quantity} ${quantity === 1 ? 'member' : 'members'}`,
    ru: (quantity: number) => {
      const remainderByHundred = quantity % 100
      const remainderByTen = quantity % 10
      const hasSingleMemberForm = remainderByTen === 1 && remainderByHundred !== 11
      const hasFewMembersForm = remainderByTen >= 2 && remainderByTen <= 4
      const hasTeenMembersForm = remainderByHundred >= 12 && remainderByHundred <= 14

      if (hasSingleMemberForm) return `${quantity} участник`
      if (hasFewMembersForm && !hasTeenMembersForm) return `${quantity} участника`

      return `${quantity} участников`
    },
    zh: (quantity: number) => `${quantity} 名成员`
  }
})
