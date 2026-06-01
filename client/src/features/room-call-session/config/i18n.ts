import { defineI18n } from 'global-shared'

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
  }
})
