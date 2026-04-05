import { defineI18n } from 'common'

export const SHOW_NOTIFICATION_SWITCHER_I18N = defineI18n({
  label: {
    en: 'Notification',
    ru: 'Уведомления'
  },
  show: {
    en: 'Show',
    ru: 'Вкл'
  },
  hide: {
    en: 'Hide',
    ru: 'Выкл'
  },
  tooltip: {
    en: 'If you want to disable or enable browser notifications, you need to do this manually in the browser settings near the address bar. Browser security policy does not allow this to be changed from the app interface. This setting controls only in-app notification toasts.',
    ru: 'Если вы хотите отключить или включить браузерные уведомления, это нужно сделать вручную в настройках браузера рядом с адресной строкой. Политика безопасности браузера не позволяет менять это из интерфейса приложения. Эта настройка управляет только внутренними toast-уведомлениями приложения.'
  }
})
