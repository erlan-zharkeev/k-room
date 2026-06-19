import { defineI18n } from 'src/shared/lib'

export const USER_ACTIVITY_STATUS_I18N = defineI18n('userActivityStatus', {
  online: {
    en: 'Online',
    ru: 'В сети',
    zh: '在线'
  },
  lastSeen: {
    en: 'Last seen',
    ru: 'Был(а) в сети',
    zh: '最后在线'
  },
  lastSeenRecently: {
    en: 'Was recently',
    ru: 'Был(а) недавно',
    zh: '最近在线'
  }
})
