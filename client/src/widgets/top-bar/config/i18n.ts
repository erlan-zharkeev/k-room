import { defineI18n } from 'global-shared'

export const MAIN_TOP_BAR_I18N = defineI18n({
  logout: {
    en: 'Logout',
    ru: 'Выйти',
    zh: '退出登录'
  },
  online: {
    en: 'Online',
    ru: 'В сети',
    zh: '在线'
  },
  offline: {
    en: 'Offline',
    ru: 'Не в сети',
    zh: '离线'
  },
  reconnecting: {
    en: 'Reconnecting',
    ru: 'Переподключение',
    zh: '正在重连'
  }
})
