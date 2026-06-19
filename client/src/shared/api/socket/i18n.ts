import { defineI18n } from 'src/shared/lib'

export const SOCKET_I18N = defineI18n('socket', {
  transportError: {
    en: 'Connection problem. Please try again later',
    ru: 'Проблема с соединением. Попробуйте позже',
    zh: '连接出现问题，请稍后重试'
  }
})
