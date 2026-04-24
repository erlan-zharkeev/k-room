import { defineI18n } from 'common'

export const CONNECTION_STATUS_INFO_I18N = defineI18n({
  disconnected: {
    en: 'Disconnected',
    ru: 'Соединение разорвано'
  },
  offline: {
    en: 'Offline',
    ru: 'Нет сети'
  },
  connecting: {
    en: 'Connecting...',
    ru: 'Подключение...'
  }
})
