import { defineI18n } from 'src/shared/lib'
export const SETTINGS_PAGE_GENERAL_I18N = defineI18n('settingsPageGeneral', {
  notifications: {
    en: 'Notifications',
    ru: 'Уведомления',
    zh: '通知'
  },
  notificationsDescription: {
    en: 'In-app notifications',
    ru: 'Уведомления внутри приложения',
    zh: '应用内通知'
  },
  sound: {
    en: 'Sound',
    ru: 'Звук',
    zh: '声音'
  },
  devices: {
    en: 'I/O Devices',
    ru: 'Устройства ввода/вывода',
    zh: '输入/输出设备'
  }
})
