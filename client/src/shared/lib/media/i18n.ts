import { defineI18n } from '../i18n/define-i18n'

export const MEDIA_DEVICE_I18N = defineI18n('mediaDevice', {
  audioInputDevice: {
    en: 'Audio input device',
    ru: 'Устройство ввода звука',
    zh: '音频输入设备'
  },
  videoInputDevice: {
    en: 'Video input device',
    ru: 'Устройство ввода видео',
    zh: '视频输入设备'
  },
  audioOutputDevice: {
    en: 'Audio output device',
    ru: 'Устройство вывода звука',
    zh: '音频输出设备'
  },
  defaultDevice: {
    en: 'Default',
    ru: 'По умолчанию',
    zh: '默认'
  },
  unknownDevice: {
    en: 'Unknown device',
    ru: 'Неизвестное устройство',
    zh: '未知设备'
  }
})
