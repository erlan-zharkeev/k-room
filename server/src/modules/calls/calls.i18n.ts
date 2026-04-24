import { defineI18n } from 'global-shared'

export const CALLS_I18N = defineI18n({
  answerCallFailed: {
    en: 'Failed to answer call',
    ru: 'Не удалось ответить на звонок'
  },
  callUserFailed: {
    en: 'Failed to start call',
    ru: 'Не удалось начать звонок'
  },
  endCallFailed: {
    en: 'Failed to end call',
    ru: 'Не удалось завершить звонок'
  },
  loadCallDataFailed: {
    en: 'Failed to load call data',
    ru: 'Не удалось загрузить данные звонка'
  },
  markCallAsVideoFailed: {
    en: 'Failed to update call mode',
    ru: 'Не удалось обновить режим звонка'
  },
  updateCallSignalFailed: {
    en: 'Failed to update call signal',
    ru: 'Не удалось обновить сигнал звонка'
  }
})
