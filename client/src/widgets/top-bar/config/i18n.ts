import { defineI18n } from 'global-shared'

export const TOP_BAR_I18N = defineI18n({
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

export const CALL_ACTIVITY_PANEL_I18N = defineI18n({
  acceptAudioRoomCall: {
    en: 'Accept with audio',
    ru: 'Ответить с аудио',
    zh: '用语音接听'
  },
  acceptVideoRoomCall: {
    en: 'Accept with video',
    ru: 'Ответить с видео',
    zh: '用视频接听'
  },
  activeRoomCall: {
    en: (title: string) => `Call in progress: ${title}`,
    ru: (title: string) => `Идет звонок: ${title}`,
    zh: (title: string) => `通话进行中：${title}`
  },
  incomingGroupRoomCall: {
    en: (title: string) => `Incoming call in ${title}`,
    ru: (title: string) => `Звонят в ${title}`,
    zh: (title: string) => `${title} 有来电`
  },
  incomingPrivateRoomCall: {
    en: (title: string) => `${title} is calling you`,
    ru: (title: string) => `Вам звонит ${title}`,
    zh: (title: string) => `${title} 正在呼叫你`
  },
  joinableRoomCall: {
    en: (title: string) => `Call in ${title}`,
    ru: (title: string) => `Звонок в ${title}`,
    zh: (title: string) => `${title} 中的通话`
  },
  leaveRoomCall: {
    en: 'Hang up',
    ru: 'Положить трубку',
    zh: '挂断'
  },
  muteIncomingRoomCall: {
    en: 'Mute incoming call',
    ru: 'Заглушить входящий звонок',
    zh: '静音来电'
  },
  outgoingRoomCall: {
    en: (title: string) => `Calling ${title}`,
    ru: (title: string) => `Вы звоните ${title}`,
    zh: (title: string) => `正在呼叫 ${title}`
  },
  openRoomCall: {
    en: 'Open call',
    ru: 'Открыть звонок',
    zh: '打开通话'
  },
  unknownRoom: {
    en: 'Unknown chat',
    ru: 'Неизвестный чат',
    zh: '未知聊天'
  }
})
