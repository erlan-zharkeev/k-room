import { defineI18n } from 'global-shared'

export const CALLS_I18N = defineI18n({
  answerCallFailed: {
    en: 'Failed to answer call',
    ru: 'Не удалось ответить на звонок',
    zh: '接听通话失败'
  },
  callUserFailed: {
    en: 'Failed to start call',
    ru: 'Не удалось начать звонок',
    zh: '发起通话失败'
  },
  endCallFailed: {
    en: 'Failed to end call',
    ru: 'Не удалось завершить звонок',
    zh: '结束通话失败'
  },
  loadCallDataFailed: {
    en: 'Failed to load call data',
    ru: 'Не удалось загрузить данные звонка',
    zh: '加载通话数据失败'
  },
  markCallAsVideoFailed: {
    en: 'Failed to update call mode',
    ru: 'Не удалось обновить режим звонка',
    zh: '更新通话模式失败'
  }
})
