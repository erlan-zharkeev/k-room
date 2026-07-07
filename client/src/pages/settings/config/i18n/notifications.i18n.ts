import { defineI18n } from 'src/shared/lib'
export const SETTINGS_PAGE_NOTIFICATIONS_I18N = defineI18n('settingsPageNotifications', {
  general: {
    en: 'General',
    ru: 'Общие',
    zh: '通用'
  },
  messages: {
    en: 'Messages',
    ru: 'Сообщения',
    zh: '消息'
  },
  calls: {
    en: 'Calls',
    ru: 'Звонки',
    zh: '通话'
  },
  privateCalls: {
    en: 'Private calls',
    ru: 'Приватные звонки',
    zh: '私聊通话'
  },
  groupCalls: {
    en: 'Group calls',
    ru: 'Групповые звонки',
    zh: '群组通话'
  },
  invites: {
    en: 'Invites',
    ru: 'Приглашения',
    zh: '邀请'
  },
  allNotifications: {
    en: 'All notifications',
    ru: 'Все уведомления',
    zh: '所有通知'
  },
  allNotificationsDescription: {
    en: 'Turns every notification channel on or off',
    ru: 'Включает или выключает все каналы уведомлений',
    zh: '开启或关闭所有通知渠道'
  },
  allToasts: {
    en: 'All toasts',
    ru: 'Все тосты',
    zh: '所有应用内提示'
  },
  allToastsDescription: {
    en: 'In-app popups for messages, calls and contact invites',
    ru: 'Всплывающие уведомления для сообщений, звонков и приглашений в контакты',
    zh: '消息、通话和联系人邀请的应用内弹窗'
  },
  allSounds: {
    en: 'All sounds',
    ru: 'Все звуки',
    zh: '所有声音'
  },
  allSoundsDescription: {
    en: 'Sound alerts for messages, calls and contact invites',
    ru: 'Звуковые сигналы для сообщений, звонков и приглашений в контакты',
    zh: '消息、通话和联系人邀请声音提醒'
  },
  allVibration: {
    en: 'All vibration',
    ru: 'Вся вибрация',
    zh: '所有振动'
  },
  allVibrationDescription: {
    en: 'Vibration for mobile devices',
    ru: 'Вибрация для мобильных устройств',
    zh: '移动设备振动'
  },
  allBrowserPush: {
    en: 'All browser push',
    ru: 'Все браузерные пуши',
    zh: '所有浏览器推送'
  },
  allBrowserPushDescription: {
    en: 'Push notifications in the web version',
    ru: 'Push-уведомления в web-версии',
    zh: 'Web 版本推送通知'
  },
  allNativePush: {
    en: 'All native push',
    ru: 'Все нативные пуши',
    zh: '所有原生推送'
  },
  allNativePushDescription: {
    en: 'Push notifications in the native app',
    ru: 'Push-уведомления в нативном приложении',
    zh: '原生应用推送通知'
  },
  messageToasts: {
    en: 'Toasts',
    ru: 'Тосты',
    zh: '应用内提示'
  },
  messageToastsDescription: {
    en: 'In-app popups for new messages',
    ru: 'Всплывающие уведомления для новых сообщений',
    zh: '新消息应用内弹窗'
  },
  messageSound: {
    en: 'Sound',
    ru: 'Звук',
    zh: '声音'
  },
  messageSoundDescription: {
    en: 'Sound alerts for new messages',
    ru: 'Звуковые сигналы для новых сообщений',
    zh: '新消息声音提醒'
  },
  messageVibration: {
    en: 'Vibration',
    ru: 'Вибрация',
    zh: '振动'
  },
  messageVibrationDescription: {
    en: 'Vibration for messages on mobile devices',
    ru: 'Вибрация для сообщений на мобильных устройствах',
    zh: '移动设备消息振动'
  },
  messageBrowserPush: {
    en: 'Browser push',
    ru: 'Браузерные пуши',
    zh: '浏览器推送'
  },
  messageBrowserPushDescription: {
    en: 'Web push notifications for messages',
    ru: 'Web push-уведомления для сообщений',
    zh: '消息 Web 推送通知'
  },
  messageNativePush: {
    en: 'Native push',
    ru: 'Нативные пуши',
    zh: '原生推送'
  },
  messageNativePushDescription: {
    en: 'Native app push notifications for messages',
    ru: 'Push-уведомления приложения для сообщений',
    zh: '消息原生应用推送通知'
  },
  callSound: {
    en: 'Sound',
    ru: 'Звук',
    zh: '声音'
  },
  callSoundDescription: {
    en: 'Sound alerts for private calls',
    ru: 'Звуковые сигналы для приватных звонков',
    zh: '私聊通话声音提醒'
  },
  callVibration: {
    en: 'Vibration',
    ru: 'Вибрация',
    zh: '振动'
  },
  callVibrationDescription: {
    en: 'Vibration for calls on mobile devices',
    ru: 'Вибрация для звонков на мобильных устройствах',
    zh: '移动设备通话振动'
  },
  callBrowserPush: {
    en: 'Browser push',
    ru: 'Браузерные пуши',
    zh: '浏览器推送'
  },
  callBrowserPushDescription: {
    en: 'Web push notifications for private calls',
    ru: 'Web push-уведомления для приватных звонков',
    zh: '私聊通话 Web 推送通知'
  },
  callNativePush: {
    en: 'Native push',
    ru: 'Нативные пуши',
    zh: '原生推送'
  },
  callNativePushDescription: {
    en: 'Native app push notifications for private calls',
    ru: 'Push-уведомления приложения для приватных звонков',
    zh: '私聊通话原生应用推送通知'
  },
  groupCallToasts: {
    en: 'Toasts',
    ru: 'Тосты',
    zh: '应用内提示'
  },
  groupCallToastsDescription: {
    en: 'In-app popups when a call starts in a group chat',
    ru: 'Всплывающие уведомления, когда в групповом чате начинается звонок',
    zh: '群聊开始通话时的应用内弹窗'
  },
  groupCallBrowserPush: {
    en: 'Browser push',
    ru: 'Браузерные пуши',
    zh: '浏览器推送'
  },
  groupCallBrowserPushDescription: {
    en: 'Web push notifications for group calls',
    ru: 'Web push-уведомления для групповых звонков',
    zh: '群组通话 Web 推送通知'
  },
  groupCallNativePush: {
    en: 'Native push',
    ru: 'Нативные пуши',
    zh: '原生推送'
  },
  groupCallNativePushDescription: {
    en: 'Native app push notifications for group calls',
    ru: 'Push-уведомления приложения для групповых звонков',
    zh: '群组通话原生应用推送通知'
  },
  inviteToasts: {
    en: 'Toasts',
    ru: 'Тосты',
    zh: '应用内提示'
  },
  inviteToastsDescription: {
    en: 'In-app popups for contact invites',
    ru: 'Всплывающие уведомления для приглашений в контакты',
    zh: '联系人邀请的应用内弹窗'
  },
  inviteSound: {
    en: 'Sound',
    ru: 'Звук',
    zh: '声音'
  },
  inviteSoundDescription: {
    en: 'Sound alerts for contact invites',
    ru: 'Звуковые сигналы для приглашений в контакты',
    zh: '联系人邀请声音提醒'
  },
  inviteBrowserPush: {
    en: 'Browser push',
    ru: 'Браузерные пуши',
    zh: '浏览器推送'
  },
  inviteBrowserPushDescription: {
    en: 'Web push notifications for contact invites',
    ru: 'Web push-уведомления для приглашений в контакты',
    zh: '联系人邀请 Web 推送通知'
  },
  inviteNativePush: {
    en: 'Native push',
    ru: 'Нативные пуши',
    zh: '原生推送'
  },
  inviteNativePushDescription: {
    en: 'Native app push notifications for contact invites',
    ru: 'Push-уведомления приложения для приглашений в контакты',
    zh: '联系人邀请原生应用推送通知'
  }
})
