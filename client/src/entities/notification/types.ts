export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export enum ClientNotificationMessage {
  NetworkOffline = 'The internet connection has been terminated. Network problems',
  NetworkOnline = 'The internet connection has been restored',
  AllowAudioContext = 'The browser requires some kind of user action to activate the sound. Click anywhere to activate the audio context.',
  CantAccessDevice = 'Can`t get access to requested device, check for browser permissions',
  MaxAttachedFilesExceed = 'The maximum number of attached images should not exceed 4',
  FailedToConnectToDevice = 'Failed to connect to device, check for device is plugged in',
  CallCompleted = 'ICall completed',
  FailedToLogin = 'Login failed, server error. Please try again, later',
  ContactAdded = 'ContactType added',
  ContactDeleted = 'ContactType deleted',
  ImageResNotAllowed = 'Image resolution not allowed',
  ImageSizeMustLessThan2mb = 'Image size must be less than 2mb',
  SocketDisconnected = 'Socket disconnected'
}
