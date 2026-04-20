import { useEffect } from 'react'

import { useMonitorInfoNotifications } from 'src/features/info-notification-actualize'

export const useInfoNotificationUpdateMonitor = () => {
  const { monitorInfoNotifications } = useMonitorInfoNotifications()

  useEffect(() => {
    return monitorInfoNotifications()
  }, [])
}
