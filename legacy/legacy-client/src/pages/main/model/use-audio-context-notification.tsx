import { useEffect } from 'react'

import { DontShowNotificationAgainBtn, NOTIFICATION_I18N, useNotification } from 'src/shared/notification'
import { useTimeout } from 'src/shared/lib'
import { useI18n, useSettings } from 'src/shared/preferences'
import { useSystem } from 'src/shared/system'

export const useAudioContextNotification = () => {
  const notifications = useNotification()
  const { t } = useI18n()
  const { soundOn, hiddenNotification } = useSettings()
  const { hasInteracted, auth } = useSystem()
  const { startTimeout } = useTimeout()

  const soundContextNotification = notifications.getNotification({
    key: 'sound-context',
    message: t(NOTIFICATION_I18N.allowAudioContext),
    messageType: 'info',
    duration: 0,
    actions: <DontShowNotificationAgainBtn notificationName="audio-context" />
  })

  useEffect(() => {
    const closeIfInteracted = () => {
      if (!hasInteracted) return false
      soundContextNotification.close('sound-context')
      return true
    }

    if (closeIfInteracted() || !soundOn) return

    startTimeout(() => {
      if (closeIfInteracted()) return
      if (hiddenNotification.includes('audio-context')) return
      if (auth !== 'authorized') return

      soundContextNotification.open()
    }, 3000)
  }, [auth, hasInteracted, hiddenNotification, soundContextNotification, soundOn, startTimeout])
}
