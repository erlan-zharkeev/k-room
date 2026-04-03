import { useEffect } from 'react'

import { useInfoNotificationActualize } from 'src/features/info-notification/info-notification-actualize'

export const useInfoNotificationUpdateMonitor = () => {
  const { monitorInfoNotificationsActualize } = useInfoNotificationActualize()

  useEffect(() => {
    monitorInfoNotificationsActualize()
  }, [])
}
