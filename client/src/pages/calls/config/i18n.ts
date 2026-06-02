import { defineI18n } from 'global-shared'

export const CALLS_PAGE_I18N = defineI18n({
  search: {
    en: 'Search call',
    ru: 'Поиск звонка',
    zh: '搜索通话'
  },
  noCalls: {
    en: 'No calls yet',
    ru: 'Звонков пока нет',
    zh: '暂无通话'
  },
  noSearchResults: {
    en: 'No calls found',
    ru: 'Звонки не найдены',
    zh: '未找到通话'
  },
  loading: {
    en: 'Loading',
    ru: 'Загрузка',
    zh: '加载中'
  },
  loadMore: {
    en: 'Load more',
    ru: 'Загрузить еще',
    zh: '加载更多'
  },
  activeCall: {
    en: 'Active',
    ru: 'Активный',
    zh: '进行中'
  },
  finishedCall: {
    en: 'Finished',
    ru: 'Завершен',
    zh: '已结束'
  },
  missedCall: {
    en: 'Missed',
    ru: 'Пропущен',
    zh: '未接'
  },
  audioCall: {
    en: 'Audio',
    ru: 'Аудио',
    zh: '语音'
  },
  videoCall: {
    en: 'Video',
    ru: 'Видео',
    zh: '视频'
  },
  screenCall: {
    en: 'Screen',
    ru: 'Экран',
    zh: '屏幕'
  },
  unknownRoom: {
    en: 'Unknown chat',
    ru: 'Неизвестный чат',
    zh: '未知聊天'
  }
})
