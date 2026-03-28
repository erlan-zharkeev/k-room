import { useEffect } from 'react'

import { DontShowNotificationAgainBtn, NOTIFICATION_I18N, useNotification } from 'src/entities/notification'
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
    message: NOTIFICATION_I18N.allowAudioContext(),
    messageType: 'info',
    duration: 0,
    actions: <DontShowNotificationAgainBtn notificationName="audio-context" />
  })

  const closeIfInteracted = () => {
    if (!hasInteracted) return false
    soundContextNotification.close('sound-context')
    return true
  }

  const handleShowNotification = () => {
    if (closeIfInteracted() || !soundOn) return

    startTimeout(() => {
      if (closeIfInteracted()) return
      if (hiddenNotification.includes('audio-context')) return
      if (auth !== 'authorized') return

      soundContextNotification.open()
    }, 3000)
  }

  useEffect(() => {
    handleShowNotification()
  }, [hasInteracted, soundContextNotification])

  return {
    soundContextNotification
  }
}
