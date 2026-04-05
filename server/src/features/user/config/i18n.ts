import { defineI18n } from 'common'

export const USER_SOCKET_I18N = defineI18n({
  actualizeUserDataFailed: {
    en: 'Failed to actualize user data',
    ru: 'Не удалось актуализировать данные пользователя'
  },
  updateLanguageFailed: {
    en: 'Failed to update language',
    ru: 'Не удалось обновить язык'
  },
  userConnectFailed: {
    en: 'Failed to update online status on connect',
    ru: 'Не удалось обновить онлайн-статус при подключении'
  },
  userDisconnectFailed: {
    en: 'Failed to update online status on disconnect',
    ru: 'Не удалось обновить онлайн-статус при отключении'
  }
})
