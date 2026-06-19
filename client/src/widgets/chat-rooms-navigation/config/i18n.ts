import { defineI18n } from 'src/shared/lib'

export const CHAT_ROOMS_NAVIGATION_I18N = defineI18n('chatRoomsNavigation', {
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
  imageMessage: {
    en: 'Photo',
    ru: 'Фото',
    zh: '图片'
  },
  documentMessage: {
    en: 'Document',
    ru: 'Документ',
    zh: '文档'
  },
  audioMessage: {
    en: 'Audio',
    ru: 'Аудио',
    zh: '音频'
  },
  videoMessage: {
    en: 'Video',
    ru: 'Видео',
    zh: '视频'
  },
  replyMessage: {
    en: 'Reply',
    ru: 'Ответ',
    zh: '回复'
  },
  forwardMessage: {
    en: 'Forward',
    ru: 'Переслано',
    zh: '转发'
  }
})
