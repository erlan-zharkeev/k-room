import { defineI18n, formatPlural } from 'global-shared'

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
  backToBottom: {
    en: 'Back to bottom',
    ru: 'К последнему сообщению',
    zh: '回到底部'
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
  replyMessage: {
    en: 'Reply',
    ru: 'Ответить',
    zh: '回复'
  },
  forwardMessage: {
    en: 'Forward',
    ru: 'Переслать',
    zh: '转发'
  },
  chatSearch: {
    en: 'Search chat',
    ru: 'Поиск чата',
    zh: '搜索聊天'
  },
  noChats: {
    en: 'There are no chats yet',
    ru: 'Чатов пока нет',
    zh: '暂无聊天'
  },
  noChatSearchResults: {
    en: 'No chats found',
    ru: 'Чаты не найдены',
    zh: '未找到聊天'
  },
  editMessage: {
    en: 'Edit message',
    ru: 'Редактировать сообщение',
    zh: '编辑消息'
  },
  editingMessage: {
    en: 'Editing message',
    ru: 'Редактирование сообщения',
    zh: '正在编辑消息'
  },
  editedMessage: {
    en: 'edited',
    ru: 'изменено',
    zh: '已编辑'
  },
  saveMessageEdit: {
    en: 'Save changes',
    ru: 'Сохранить изменения',
    zh: '保存更改'
  },
  removeMessageAttachment: {
    en: 'Remove attachment',
    ru: 'Удалить вложение',
    zh: '删除附件'
  },
  messageTextCopied: {
    en: 'Message text copied',
    ru: 'Текст сообщения скопирован',
    zh: '消息文本已复制'
  },
  pinMessage: {
    en: 'Pin message',
    ru: 'Pin message',
    zh: 'Pin message'
  },
  unpinMessage: {
    en: 'Unpin message',
    ru: 'Unpin message',
    zh: 'Unpin message'
  },
  pinnedMessage: {
    en: 'Pinned message',
    ru: 'Pinned message',
    zh: 'Pinned message'
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
  messageAttachmentInvalidFormat: {
    en: 'File format is not supported. Supported extensions: jpg, jpeg, png, gif, svg, webp, pdf, zip, rar, 7z, mp3, ogg, wav, mp4, webm, mov.',
    ru: 'Формат файла не поддерживается. Доступные расширения: jpg, jpeg, png, gif, svg, webp, pdf, zip, rar, 7z, mp3, ogg, wav, mp4, webm, mov.',
    zh: '不支持该文件格式。支持的扩展名：jpg、jpeg、png、gif、svg、webp、pdf、zip、rar、7z、mp3、ogg、wav、mp4、webm、mov。'
  },
  messageImageInvalidSize: {
    en: (size: number) => `Image must be less than ${size} MB`,
    ru: (size: number) => `Изображение должно быть меньше ${size} МБ`,
    zh: (size: number) => `图片必须小于 ${size} MB`
  },
  messageDocumentInvalidSize: {
    en: (size: number) => `Document must be less than ${size} MB`,
    ru: (size: number) => `Документ должен быть меньше ${size} МБ`,
    zh: (size: number) => `文档必须小于 ${size} MB`
  },
  messageAudioInvalidSize: {
    en: (size: number) => `Audio must be less than ${size} MB`,
    ru: (size: number) => `Аудио должно быть меньше ${size} МБ`,
    zh: (size: number) => `音频必须小于 ${size} MB`
  },
  messageVideoInvalidSize: {
    en: (size: number) => `Video must be less than ${size} MB`,
    ru: (size: number) => `Видео должно быть меньше ${size} МБ`,
    zh: (size: number) => `视频必须小于 ${size} MB`
  },
  messageAttachmentLimitReached: {
    en: (limit: number) => `You can attach up to ${limit} files. The list was reduced.`,
    ru: (limit: number) => `Можно прикрепить до ${limit} файлов. Список сокращен.`,
    zh: (limit: number) => `最多可附加 ${limit} 个文件。列表已缩减。`
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
    en: (quantity: number) => formatPlural('en', quantity, { one: 'member', other: 'members' }),
    ru: (quantity: number) =>
      formatPlural('ru', quantity, {
        few: 'участника',
        many: 'участников',
        one: 'участник',
        other: 'участника'
      }),
    zh: (quantity: number) => formatPlural('zh', quantity, { other: '名成员' })
  }
})
