import { isFunction } from 'global-shared'

import { APP_NOTIFICATION_SOUND_SRC } from './constants'

export const playAppNotificationSound = async (audioOutputDeviceId: string) => {
  const audio = new Audio(APP_NOTIFICATION_SOUND_SRC)

  if (isFunction(audio.setSinkId) && audioOutputDeviceId) {
    await audio.setSinkId(audioOutputDeviceId)
  }

  await audio.play()
}
