import { defineI18n } from 'src/shared/lib'

export const BROWSER_PUSH_PERMISSION_I18N = defineI18n('browserPushPermission', {
  title: {
    en: 'Do not miss messages and calls',
    ru: 'Не пропускайте сообщения и звонки',
    zh: '不要错过消息和通话'
  },
  description: {
    en: 'Installing the app does not enable notifications automatically. Allow them separately to receive messages and incoming calls while K Room is closed.',
    ru: 'Установка приложения не включает уведомления автоматически. Разрешите их отдельно, чтобы получать сообщения и входящие звонки, когда K Room закрыт.',
    zh: '安装应用不会自动启用通知。请单独授予权限，以便在 K Room 关闭时接收消息和来电。'
  },
  deniedTitle: {
    en: 'Notifications are blocked',
    ru: 'Уведомления заблокированы',
    zh: '通知已被阻止'
  },
  deniedDescription: {
    en: 'The browser or system has blocked notifications for K Room. Allow them in your device settings, then return to the app.',
    ru: 'Браузер или система запретили уведомления для K Room. Разрешите их в настройках устройства, затем вернитесь в приложение.',
    zh: '浏览器或系统已阻止 K Room 通知。请在设备设置中允许通知，然后返回应用。'
  },
  enable: {
    en: 'Enable notifications',
    ru: 'Включить уведомления',
    zh: '启用通知'
  },
  settings: {
    en: 'Notification settings',
    ru: 'Настройки уведомлений',
    zh: '通知设置'
  }
})
