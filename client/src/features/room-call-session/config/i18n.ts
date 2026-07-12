import { formatPlural } from 'global-shared'

import { defineI18n, i18nFormatter } from 'src/shared/lib'

export const ROOM_CALL_SESSION_I18N = defineI18n('roomCallSession', {
  startAudioRoomCall: {
    en: 'Start audio call',
    ru: 'Начать аудиозвонок',
    zh: '开始语音通话'
  },
  startVideoRoomCall: {
    en: 'Start video call',
    ru: 'Начать видеозвонок',
    zh: '开始视频通话'
  },
  startScreenRoomCall: {
    en: 'Share screen',
    ru: 'Поделиться экраном',
    zh: '共享屏幕'
  },
  toggleAudioRoomCall: {
    en: 'Toggle microphone',
    ru: 'Включить или выключить микрофон',
    zh: '切换麦克风'
  },
  toggleVideoRoomCall: {
    en: 'Toggle camera',
    ru: 'Включить или выключить камеру',
    zh: '切换摄像头'
  },
  roomCallDevices: {
    en: 'Call devices',
    ru: 'Устройства звонка',
    zh: '通话设备'
  },
  switchVideoInputFacingMode: {
    en: 'Switch camera',
    ru: 'Переключить камеру',
    zh: '切换摄像头'
  },
  toggleScreenRoomCall: {
    en: 'Toggle screen sharing',
    ru: 'Включить или выключить демонстрацию экрана',
    zh: '切换屏幕共享'
  },
  enterFullscreenRoomCall: {
    en: 'Enter fullscreen',
    ru: 'Открыть на весь экран',
    zh: '进入全屏'
  },
  exitFullscreenRoomCall: {
    en: 'Exit fullscreen',
    ru: 'Выйти из полноэкранного режима',
    zh: '退出全屏'
  },
  leaveRoomCall: {
    en: 'Leave call',
    ru: 'Выйти из звонка',
    zh: '离开通话'
  },
  activeRoomCall: {
    en: 'Call in progress',
    ru: 'Идет звонок',
    zh: '通话进行中'
  },
  activeRoomCallActivity: {
    en: i18nFormatter(['title'], (title: string) => `Call in progress: ${title}`),
    ru: i18nFormatter(['title'], (title: string) => `Идет звонок: ${title}`),
    zh: i18nFormatter(['title'], (title: string) => `通话进行中：${title}`)
  },
  incomingGroupRoomCall: {
    en: i18nFormatter(['title'], (title: string) => `Incoming call in ${title}`),
    ru: i18nFormatter(['title'], (title: string) => `В ${title} идет звонок`),
    zh: i18nFormatter(['title'], (title: string) => `${title} 有来电`)
  },
  incomingGroupRoomCallBrowserPush: {
    en: i18nFormatter(['title'], (title: string) => `A meeting started in group chat ${title}`),
    ru: i18nFormatter(['title'], (title: string) => `В групповом чате ${title} началась встреча`),
    zh: i18nFormatter(['title'], (title: string) => `群聊 ${title} 中开始了一场会议`)
  },
  incomingPrivateRoomCall: {
    en: i18nFormatter(['title'], (title: string) => `${title} is calling you`),
    ru: i18nFormatter(['title'], (title: string) => `Вам звонит ${title}`),
    zh: i18nFormatter(['title'], (title: string) => `${title} 正在呼叫你`)
  },
  incomingPrivateRoomCallBrowserPush: {
    en: i18nFormatter(['title'], (title: string) => `${title} is calling you`),
    ru: i18nFormatter(['title'], (title: string) => `Вам звонит ${title}`),
    zh: i18nFormatter(['title'], (title: string) => `${title} 正在呼叫你`)
  },
  joinableRoomCall: {
    en: i18nFormatter(['title'], (title: string) => `Call in ${title}`),
    ru: i18nFormatter(['title'], (title: string) => `Звонок в ${title}`),
    zh: i18nFormatter(['title'], (title: string) => `${title} 中的通话`)
  },
  openRoomCall: {
    en: 'Open call',
    ru: 'Открыть звонок',
    zh: '打开通话'
  },
  outgoingRoomCall: {
    en: i18nFormatter(['title'], (title: string) => `Calling ${title}`),
    ru: i18nFormatter(['title'], (title: string) => `Вы звоните ${title}`),
    zh: i18nFormatter(['title'], (title: string) => `正在呼叫 ${title}`)
  },
  unknownRoom: {
    en: 'Unknown chat',
    ru: 'Неизвестный чат',
    zh: '未知聊天'
  },
  joinAudioRoomCall: {
    en: 'Join with audio',
    ru: 'Присоединиться с аудио',
    zh: '加入语音通话'
  },
  joinVideoRoomCall: {
    en: 'Join with video',
    ru: 'Присоединиться с видео',
    zh: '加入视频通话'
  },
  answerAudioRoomCall: {
    en: 'Answer with audio',
    ru: 'Ответить с аудио',
    zh: '用语音接听'
  },
  answerVideoRoomCall: {
    en: 'Answer with video',
    ru: 'Ответить с видео',
    zh: '用视频接听'
  },
  roomCallParticipants: {
    en: i18nFormatter(['quantity'], (quantity: number) =>
      formatPlural('en', quantity, { one: 'participant', other: 'participants' })
    ),
    ru: i18nFormatter(['quantity'], (quantity: number) =>
      formatPlural('ru', quantity, {
        few: 'участника',
        many: 'участников',
        one: 'участник',
        other: 'участника'
      })
    ),
    zh: i18nFormatter(['quantity'], (quantity: number) => formatPlural('zh', quantity, { other: '位参与者' }))
  },
  roomCallStartFailed: {
    en: 'Could not start call. Check microphone and camera access in browser and system settings.',
    ru: 'Не удалось начать звонок. Проверьте доступ к микрофону и камере в браузере и системе.',
    zh: '无法开始通话。请检查浏览器和系统中的麦克风和摄像头权限。'
  },
  roomCallJoinFailed: {
    en: 'Could not join call. Check microphone and camera access in browser and system settings.',
    ru: 'Не удалось присоединиться к звонку. Проверьте доступ к микрофону и камере в браузере и системе.',
    zh: '无法加入通话。请检查浏览器和系统中的麦克风和摄像头权限。'
  },
  roomCallConnectionFailed: {
    en: 'Could not establish call connection. Please try again.',
    ru: 'Не удалось установить соединение для звонка. Попробуйте ещё раз.',
    zh: '无法建立通话连接。请重试。'
  },
  roomCallAudioStartFailed: {
    en: 'Could not turn on microphone. Check microphone access in browser and system settings.',
    ru: 'Не удалось включить микрофон. Проверьте доступ к микрофону в браузере и системе.',
    zh: '无法打开麦克风。请检查浏览器和系统中的麦克风权限。'
  },
  roomCallVideoStartFailed: {
    en: 'Could not turn on camera. Check camera access in browser and system settings.',
    ru: 'Не удалось включить камеру. Проверьте доступ к камере в браузере и системе.',
    zh: '无法打开摄像头。请检查浏览器和系统中的摄像头权限。'
  },
  roomCallScreenStartFailed: {
    en: 'Could not share screen. Check screen sharing access in browser and system settings.',
    ru: 'Не удалось поделиться экраном. Проверьте доступ к демонстрации экрана в браузере и системе.',
    zh: '无法共享屏幕。请检查浏览器和系统中的屏幕共享权限。'
  }
})
