import { SocketActionsType } from 'common'

import { useInfoNotification } from 'src/entities/info-notification'

import { socket } from 'src/shared/api'

export const useMarkInfoNotificationAsRead = () => {
  const { isRead } = useInfoNotification()

  const markAsRead = async (id: string) => {
    try {
      if (isRead(id)) return
      socket.emit<SocketActionsType>('mark-info-notification-as-read', { id })
    } catch {}
  }

  return { markAsRead }
}
