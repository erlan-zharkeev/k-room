import { defineI18n } from 'global-shared'

export const CHAT_ROOM_PAGE_I18N = defineI18n({
  roomsTitle: {
    en: 'Chats',
    ru: 'Чаты',
    zh: '聊天'
  },
  search: {
    en: 'Search chat',
    ru: 'Поиск чата',
    zh: '搜索聊天'
  },
  createChat: {
    en: 'Create chat',
    ru: 'Создать чат',
    zh: '创建聊天'
  },
  createChatFailed: {
    en: 'Failed to create chat',
    ru: 'Не удалось создать чат',
    zh: '无法创建聊天'
  },
  openChat: {
    en: 'Open chat',
    ru: 'Открыть чат',
    zh: '打开聊天'
  },
  chatActions: {
    en: 'Chat actions',
    ru: 'Действия чата',
    zh: '聊天操作'
  },
  markAsRead: {
    en: 'Mark as read',
    ru: 'Отметить прочитанным',
    zh: '标为已读'
  },
  pinChat: {
    en: 'Pin chat',
    ru: 'Закрепить чат',
    zh: '置顶聊天'
  },
  unpinChat: {
    en: 'Unpin chat',
    ru: 'Открепить чат',
    zh: '取消置顶'
  },
  deleteChat: {
    en: 'Delete chat',
    ru: 'Удалить чат',
    zh: '删除聊天'
  },
  deleteChatTitle: {
    en: 'Delete chat',
    ru: 'Удалить чат',
    zh: '删除聊天'
  },
  deleteChatConfirm: {
    en: 'Are you sure you want to delete this chat?',
    ru: 'Вы уверены, что хотите удалить этот чат?',
    zh: '确定要删除此聊天吗？'
  },
  createChatTitle: {
    en: 'New chat',
    ru: 'Новый чат',
    zh: '新聊天'
  },
  chatName: {
    en: 'Chat name',
    ru: 'Название чата',
    zh: '聊天名称'
  },
  uploadChatImage: {
    en: 'Upload chat image',
    ru: 'Загрузить изображение чата',
    zh: '上传聊天图片'
  },
  chatImageInvalidFormat: {
    en: 'Only image files are supported',
    ru: 'Поддерживаются только изображения',
    zh: '仅支持图片文件'
  },
  chatImageInvalidSize: {
    en: (size: number) => `Chat image must be less than ${size} MB`,
    ru: (size: number) => `Изображение чата должно быть меньше ${size} МБ`,
    zh: (size: number) => `聊天图片必须小于 ${size} MB`
  },
  chatImageReadFailed: {
    en: 'Failed to prepare chat image',
    ru: 'Не удалось подготовить изображение чата',
    zh: '无法准备聊天图片'
  },
  contactSearch: {
    en: 'Search contacts',
    ru: 'Поиск контактов',
    zh: '搜索联系人'
  },
  contacts: {
    en: 'Contacts',
    ru: 'Контакты',
    zh: '联系人'
  },
  noContacts: {
    en: 'No accepted contacts',
    ru: 'Нет подтвержденных контактов',
    zh: '暂无已接受的联系人'
  },
  noContactSearchResults: {
    en: 'No contacts found',
    ru: 'Контакты не найдены',
    zh: '未找到联系人'
  },
  noChats: {
    en: 'There are no chats yet',
    ru: 'Чатов пока нет',
    zh: '暂无聊天'
  },
  noSearchResults: {
    en: 'No chats found',
    ru: 'Чаты не найдены',
    zh: '未找到聊天'
  },
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
  typing: {
    en: 'typing',
    ru: 'печатает',
    zh: '正在输入'
  },
  cancel: {
    en: 'Cancel',
    ru: 'Отмена',
    zh: '取消'
  }
})
