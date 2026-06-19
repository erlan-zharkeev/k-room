import { defineI18n } from 'src/shared/lib'

export const APP_NAVIGATION_I18N = defineI18n('appNavigation', {
  chatRooms: {
    en: 'Chats',
    ru: 'Чаты',
    zh: '聊天'
  },
  calls: {
    en: 'Calls',
    ru: 'Звонки',
    zh: '通话'
  },
  contacts: {
    en: 'Contacts',
    ru: 'Контакты',
    zh: '联系人'
  },
  settings: {
    en: 'Settings',
    ru: 'Настройки',
    zh: '设置'
  }
})
