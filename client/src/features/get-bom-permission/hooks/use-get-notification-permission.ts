import { useEffect } from 'react'

export const useGetNotificationPermission = () => {
  const getNotificationPermission = () => {
    useEffect(() => {
      if (!('Notification' in window)) {
        console.log('Browser doesn`t support Notification Api')
      }
      window.Notification.requestPermission()
    }, [])
  }

  return {
    getNotificationPermission
  }
}
