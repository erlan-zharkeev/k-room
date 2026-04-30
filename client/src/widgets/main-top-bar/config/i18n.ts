import { defineI18n } from 'global-shared'

export const MAIN_TOP_BAR_I18N = defineI18n({
  logout: {
    en: 'Logout',
    ru: 'Выйти',
    zh: '退出登录'
  },
  online: {
    en: 'online',
    ru: 'в сети',
    zh: '在线'
  },
  offline: {
    en: 'offline',
    ru: 'не в сети',
    zh: '离线'
  },
  reconnecting: {
    en: 'reconnecting',
    ru: 'переподключение',
    zh: '正在重连'
  }
})
