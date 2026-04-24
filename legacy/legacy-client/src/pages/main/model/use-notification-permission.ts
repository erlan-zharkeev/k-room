import { useEffect } from 'react'

import { useSystem } from 'src/shared/system'

export const useNotificationPermission = () => {
  const { hasInteracted } = useSystem()

  useEffect(() => {
    if (!hasInteracted) return
    if (!('Notification' in window)) {
      console.log('Browser doesn`t support Notification Api')
      return
    }

    window.Notification.requestPermission()
  }, [hasInteracted])
}
