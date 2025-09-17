export const NOTIFICATION_MESSAGE = {
  networkOffline: () =>
    'The internet connection has been terminated. Network problems',

  networkOnline: () =>
    'The internet connection has been restored',

  allowAudioContext: () =>
    'The browser requires some kind of user action to activate the sound. Click anywhere to activate the audio context.',

  cantAccessDevice: () =>
    'Can’t get access to requested device, check for browser permissions',

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
}
