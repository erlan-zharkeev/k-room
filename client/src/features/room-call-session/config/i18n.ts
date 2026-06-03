import { defineI18n, formatPlural } from 'global-shared'

export const ROOM_CALL_SESSION_I18N = defineI18n({
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
  toggleScreenRoomCall: {
    en: 'Toggle screen sharing',
    ru: 'Включить или выключить демонстрацию экрана',
    zh: '切换屏幕共享'
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
  joinRoomCall: {
    en: 'Join',
    ru: 'Присоединиться',
    zh: '加入'
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
  roomCallParticipants: {
    en: (quantity: number) => formatPlural('en', quantity, { one: 'participant', other: 'participants' }),
    ru: (quantity: number) =>
      formatPlural('ru', quantity, {
        few: 'участника',
        many: 'участников',
        one: 'участник',
        other: 'участника'
      }),
    zh: (quantity: number) => formatPlural('zh', quantity, { other: '位参与者' })
  },
  roomCallStartFailed: {
    en: 'Could not start call. Check browser media permissions.',
    ru: 'Не удалось начать звонок. Проверьте доступ к медиа в браузере.',
    zh: '无法开始通话。请检查浏览器媒体权限。'
  },
  roomCallJoinFailed: {
    en: 'Could not join call. Check browser media permissions.',
    ru: 'Не удалось присоединиться к звонку. Проверьте доступ к медиа в браузере.',
    zh: '无法加入通话。请检查浏览器媒体权限。'
  },
  roomCallAccessFailed: {
    en: 'You do not have access to this call.',
    ru: 'У вас нет доступа к этому звонку.',
    zh: '你没有访问此通话的权限。'
  },
  roomCallAlreadyActive: {
    en: 'A call is already active in this chat.',
    ru: 'В этом чате уже идет звонок.',
    zh: '此聊天中已有正在进行的通话。'
  },
  roomCallLimitReached: {
    en: 'Call is full.',
    ru: 'Звонок уже заполнен.',
    zh: '通话人数已满。'
  },
  roomCallAudioStartFailed: {
    en: 'Could not turn on microphone. Check browser permissions.',
    ru: 'Не удалось включить микрофон. Проверьте доступ в браузере.',
    zh: '无法打开麦克风。请检查浏览器权限。'
  },
  roomCallVideoStartFailed: {
    en: 'Could not turn on camera. Check browser permissions.',
    ru: 'Не удалось включить камеру. Проверьте доступ в браузере.',
    zh: '无法打开摄像头。请检查浏览器权限。'
  },
  roomCallScreenStartFailed: {
    en: 'Could not share screen. Check browser permissions.',
    ru: 'Не удалось поделиться экраном. Проверьте доступ в браузере.',
    zh: '无法共享屏幕。请检查浏览器权限。'
  }
})
