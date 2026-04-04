import { useEffect } from 'react'

import { useInfoNotificationActualize } from './../../info-notification-actualize'

export const useInfoNotificationUpdateMonitor = () => {
  const { monitorInfoNotificationsActualize } = useInfoNotificationActualize()

  useEffect(() => {
    return monitorInfoNotificationsActualize()
  }, [])
}
