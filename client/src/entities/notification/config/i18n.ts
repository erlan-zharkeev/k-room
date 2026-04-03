import { LocalizedTextType } from 'common'

export const NOTIFICATION_I18N = {
  networkOffline: {
    en: 'The internet connection has been terminated. Network problems',
    ru: 'Интернет-соединение прервано. Проблемы с сетью'
  },
  networkOnline: {
    en: 'The internet connection has been restored',
    ru: 'Интернет-соединение восстановлено'
  },
  allowAudioContext: {
    en: 'The browser requires some kind of user action to activate the sound. Click anywhere to activate the audio context.',
    ru: 'Браузеру нужно действие пользователя, чтобы включить звук. Кликните в любое место, чтобы активировать аудиоконтекст.'
  },
  cantAccessDevice: {
    en: 'Can’t get access to requested device, check for browser permissions',
    ru: 'Не удалось получить доступ к устройству, проверьте разрешения браузера'
  },
  maxAttachedFilesExceed: (max: number) =>
    ({
      en: `The maximum number of attached images should not exceed ${max}`,
      ru: `Максимальное количество прикрепленных изображений не должно превышать ${max}`
    }) as const,
  failedToConnectToDevice: {
    en: 'Failed to connect to device, check if device is plugged in',
    ru: 'Не удалось подключиться к устройству, проверьте, подключено ли оно'
  },
  callCompleted: {
    en: 'Call completed',
    ru: 'Звонок завершен'
  },
  failedToLogin: {
    en: 'Login failed, server error. Please try again later',
    ru: 'Не удалось войти. Ошибка сервера. Попробуйте позже'
  },
  imageResNotAllowed: {
    en: 'Image resolution not allowed',
    ru: 'Недопустимый формат изображения'
  },
  imageSizeMustLessThan: (mb: number) =>
    ({
      en: `Image size must be less than ${mb} MB`,
      ru: `Размер изображения должен быть меньше ${mb} МБ`
    }) as const,
  socketDisconnected: {
    en: 'Socket disconnected',
    ru: 'Соединение с сокетом разорвано'
  }
} as const satisfies Record<string, LocalizedTextType | ((...args: number[]) => LocalizedTextType)>
