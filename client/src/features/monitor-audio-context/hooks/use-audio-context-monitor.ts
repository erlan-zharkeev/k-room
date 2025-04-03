import { useEffect, useRef } from 'react'

import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { ClientNotificationMessage, useNotification } from 'src/entities/notification'
import { useSettings } from 'src/entities/settings'
import { enableAllowAudioContext, useSystem } from 'src/entities/system'
import { useUser } from 'src/entities/user'

export const useAudioContextMonitor = () => {
  const dispatch = useDispatch<AppDispatch>()
  const notifications = useNotification()
  const { allowAudioContext } = useSystem()
  const { soundOn } = useSettings()
  const { isAuth } = useUser()
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const enableAudioInBrowser = () => {
    dispatch(enableAllowAudioContext())
    window.removeEventListener('click', enableAudioInBrowser)
  }

  const soundContextNotification = notifications.getNotification({
    key: 'sound-context',
    message: ClientNotificationMessage.AllowAudioContext,
    messageType: 'info',
    duration: 0
  })

  const monitorToShowAudioContextNotification = () => {
    window.addEventListener('click', enableAudioInBrowser)
    if (soundOn && !allowAudioContext) {
      timeoutRef.current = setTimeout(() => {
        if (isAuth) soundContextNotification.open()
      }, 3000)
    }
  }

  useEffect(() => {
    if (allowAudioContext) {
      soundContextNotification.close('sound-context')
    }
  }, [allowAudioContext])

  useEffect(() => {
    monitorToShowAudioContextNotification()
    return () => {
      window.removeEventListener('click', enableAudioInBrowser)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])
}
