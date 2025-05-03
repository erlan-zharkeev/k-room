import { useMemo } from 'react'

import { useUser } from 'src/entities/user'

export const useUnreadInfoNotification = () => {
  const { infoNotifications } = useUser()

  const unreadInfoNotificationQuantity = useMemo(
    () => Number(infoNotifications?.filter((item) => !item.read).length),
    [infoNotifications]
  )

  return { unreadInfoNotificationQuantity }
}
