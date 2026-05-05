import { defineI18n } from 'global-shared'

export const MAIN_PAGE_I18N = defineI18n({
  messageActions: {
    en: 'Message actions',
    ru: 'Действия сообщения',
    zh: '消息操作'
  },
  expandEmojiPicker: {
    en: 'Expand emoji list',
    ru: 'Развернуть список эмодзи',
    zh: '展开表情列表'
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
  deleteMessage: {
    en: 'Delete',
    ru: 'Удалить',
    zh: '删除'
  },
  noMessages: {
    en: 'There are no messages yet',
    ru: 'Сообщений пока нет',
    zh: '暂无消息'
  },
  loadMore: {
    en: 'Load more',
    ru: 'Загрузить еще',
    zh: '加载更多'
  }
})
