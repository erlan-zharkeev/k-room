import { useEffect, useRef } from 'react'

import { ClientNotificationMessage, useNotification } from 'src/entities/notification'
import { useSettings } from 'src/entities/settings'
import { useSystem } from 'src/entities/system'
import { useUser } from 'src/entities/user'

export const useAudioContextMonitor = () => {
  const notifications = useNotification()
  const { soundOn } = useSettings()
  const { isAuth } = useUser()
  const { hasInteracted } = useSystem()

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

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
      timeoutRef.current = setTimeout(() => {
        if (isAuth) soundContextNotification.open()
      }, 3000)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [hasInteracted])

  return {
    soundContextNotification
  }
}
