import { useEffect } from 'react'

import { useMonitorInfoNotifications } from './../../info-notification-actualize'

export const useInfoNotificationUpdateMonitor = () => {
  const { monitorInfoNotifications } = useMonitorInfoNotifications()

  useEffect(() => {
    return monitorInfoNotifications()
  }, [])
}
