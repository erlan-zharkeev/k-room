import { type LocalizedTextType } from 'common'

export const NOTIFICATION_I18N = {
  networkOffline: () =>
    'The internet connection has been terminated. Network problems',

  networkOnline: () =>
    'The internet connection has been restored',

  allowAudioContext: () =>
    'The browser requires some kind of user action to activate the sound. Click anywhere to activate the audio context.',

  cantAccessDevice: {
    en: 'Can’t get access to requested device, check for browser permissions',
    ru: 'Не удалось получить доступ к устройству, проверьте разрешения браузера'
  },

  maxAttachedFilesExceed: (max: number) =>
    `The maximum number of attached images should not exceed ${max}`,

  failedToConnectToDevice: () =>
    'Failed to connect to device, check if device is plugged in',

  callCompleted: () =>
    'Call completed',

  failedToLogin: () =>
    'Login failed, server error. Please try again later',

  imageResNotAllowed: () =>
    'Image resolution not allowed',

  imageSizeMustLessThan: (mb: number) =>
    `Image size must be less than ${mb} MB`,

  socketDisconnected: () =>
    'Socket disconnected'
} as const satisfies Record<string, LocalizedTextType | ((...args: never[]) => string) | ((...args: number[]) => string)>

export const ERROR_NOTIFICATION_DURATION_IN_SEC = 10
