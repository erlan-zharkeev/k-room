import { useEffect } from 'react'

import { useSystem } from 'src/entities/system'

export const useGetNotificationPermission = () => {
  const { hasInteracted } = useSystem()

  const getNotificationPermission = () => {
    if (!('Notification' in window)) {
      console.log('Browser doesn`t support Notification Api')
    }
    window.Notification.requestPermission()
  }

  useEffect(() => {
    if (!hasInteracted) return
    getNotificationPermission()
  }, [hasInteracted])

  return {
    getNotificationPermission
  }
}
