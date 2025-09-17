import { useEffect } from 'react'

import { DontShowNotificationAgainBtn, NOTIFICATION_MESSAGE, useNotification } from 'src/entities/notification'
import { useSettings } from 'src/entities/settings'
import { useSystem } from 'src/entities/system'

import { useTimeout } from 'src/shared/lib'

export const useAudioContextMonitor = () => {
  const notifications = useNotification()
  const { soundOn, hiddenNotification } = useSettings()
  const { hasInteracted, auth } = useSystem()
  const { startTimeout } = useTimeout()

  const soundContextNotification = notifications.getNotification({
    key: 'sound-context',
    message: NOTIFICATION_MESSAGE.allowAudioContext(),
    messageType: 'info',
    duration: 0,
    actions: <DontShowNotificationAgainBtn notificationName="audio-context" />
  })

  const handleShowNotification = () => {
    if (hasInteracted) {
      soundContextNotification.close('sound-context')
    } else {
      if (!soundOn) return
      startTimeout(() => {
        if (hasInteracted) {
          soundContextNotification.close('sound-context')
        }
        if (hiddenNotification.includes('audio-context')) return
        if (auth === 'authorized') soundContextNotification.open()
      }, 3000)
    }
  }

  useEffect(() => {
    handleShowNotification()
  }, [hasInteracted, soundContextNotification])

  return {
    soundContextNotification
  }
}
