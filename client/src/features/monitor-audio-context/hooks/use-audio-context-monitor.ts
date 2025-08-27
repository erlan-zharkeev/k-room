import { useEffect } from 'react'

import { ClientNotificationMessage, useNotification } from 'src/entities/notification'
import { useSettings } from 'src/entities/settings'
import { useSystem } from 'src/entities/system'

import { useTimeout } from 'src/shared/lib'

export const useAudioContextMonitor = () => {
  const notifications = useNotification()
  const { soundOn } = useSettings()
  const { hasInteracted, isAuth } = useSystem()
  const { startTimeout } = useTimeout()

  const soundContextNotification = notifications.getNotification({
    key: 'sound-context',
    message: ClientNotificationMessage.AllowAudioContext,
    messageType: 'info',
    duration: 0
  })

  useEffect(() => {
    if (hasInteracted) {
      soundContextNotification.close('sound-context')
    } else {
      if (!soundOn) return
      startTimeout(() => {
        if (isAuth) soundContextNotification.open()
      }, 3000)
    }
  }, [hasInteracted])

  return {
    soundContextNotification
  }
}
