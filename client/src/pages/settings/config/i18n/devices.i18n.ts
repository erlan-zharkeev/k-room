import { defineI18n, i18nFormatter } from 'src/shared/lib'
export const SETTINGS_PAGE_DEVICES_I18N = defineI18n('settingsPageDevices', {
  audioInputDevice: {
    en: 'Audio input device',
    ru: 'Устройство ввода звука',
    zh: '音频输入设备'
  },
  audioInputDeviceDescription: {
    en: 'Microphone used for calls',
    ru: 'Микрофон для звонков',
    zh: '通话使用的麦克风'
  },
  permissionStatus: {
    en: i18nFormatter(['status'], (status: string) => `Permission: ${status}`),
    ru: i18nFormatter(['status'], (status: string) => `Разрешение: ${status}`),
    zh: i18nFormatter(['status'], (status: string) => `权限：${status}`)
  },
  permissionGranted: {
    en: 'granted',
    ru: 'разрешено',
    zh: '已允许'
  },
  permissionDenied: {
    en: 'denied',
    ru: 'запрещено',
    zh: '已拒绝'
  },
  permissionPrompt: {
    en: 'not granted or browser could not confirm access',
    ru: 'не запрошено',
    zh: '未请求'
  },
  permissionUnsupported: {
    en: 'unsupported',
    ru: 'не поддерживается',
    zh: '不支持'
  },
  permissionBrowserControlled: {
    en: 'browser controlled',
    ru: 'управляется браузером',
    zh: '由浏览器控制'
  },
  permissionUnknown: {
    en: 'unknown',
    ru: 'неизвестно',
    zh: '未知'
  },
  testAudioInput: {
    en: 'Test microphone',
    ru: 'Проверить микрофон',
    zh: '测试麦克风'
  },
  stopAudioInputCheck: {
    en: 'Stop microphone check',
    ru: 'Остановить проверку микрофона',
    zh: '停止麦克风测试'
  },
  testDeviceCheck: {
    en: 'Test',
    ru: 'Проверка',
    zh: '测试'
  },
  stopDeviceCheck: {
    en: 'Stop',
    ru: 'Остановить',
    zh: '停止'
  },
  audioInputLevel: {
    en: 'Microphone input level',
    ru: 'Уровень входа микрофона',
    zh: '麦克风输入音量'
  },
  videoInputDevice: {
    en: 'Video input device',
    ru: 'Устройство ввода видео',
    zh: '视频输入设备'
  },
  videoInputDeviceDescription: {
    en: 'Camera used for video calls',
    ru: 'Камера для видеозвонков',
    zh: '视频通话使用的摄像头'
  },
  testVideoInput: {
    en: 'Test camera',
    ru: 'Проверить камеру',
    zh: '测试摄像头'
  },
  stopVideoInputCheck: {
    en: 'Stop camera check',
    ru: 'Остановить проверку камеры',
    zh: '停止摄像头测试'
  },
  audioOutputDevice: {
    en: 'Audio output device',
    ru: 'Устройство вывода звука',
    zh: '音频输出设备'
  },
  audioOutputDeviceDescription: {
    en: 'Speaker used for notifications and calls',
    ru: 'Динамик для уведомлений и звонков',
    zh: '通知和通话使用的扬声器'
  },
  testAudioOutput: {
    en: 'Test speaker',
    ru: 'Проверить динамик',
    zh: '测试扬声器'
  },
  notAvailable: {
    en: 'Permissions were not granted or the devices were not detected.',
    ru: 'Разрешения не были выданы или устройства не обнаружены.',
    zh: '未授予权限或未检测到设备。'
  },
  cantAccessDevice: {
    en: 'Can’t get access to requested device, check browser permissions. You can change them in the site settings from the browser address bar.',
    ru: 'Не удалось получить доступ к устройству, проверьте разрешения браузера. Разрешения можно изменить в настройках сайта в адресной строке браузера.',
    zh: '无法访问请求的设备，请检查浏览器权限。你可以在浏览器地址栏中的网站设置里更改权限。'
  },
  mediaUnsupported: {
    en: 'Media devices are not supported in this environment',
    ru: 'Медиаустройства не поддерживаются в этом окружении',
    zh: '当前环境不支持媒体设备'
  },
  unknownDevice: {
    en: 'Unknown device',
    ru: 'Неизвестное устройство',
    zh: '未知设备'
  },
  videoPreview: {
    en: 'Camera preview',
    ru: 'Предпросмотр камеры',
    zh: '摄像头预览'
  }
})
