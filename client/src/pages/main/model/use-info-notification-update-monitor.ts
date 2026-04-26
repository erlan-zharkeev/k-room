import type {
  EventGetInfoNotificationsType,
  EventInfoNotificationReceivedType,
  IEventInfoNotificationStatusUpdated,
  SocketActionsType
} from 'global-shared'
import { onBeforeUnmount } from 'vue'

import { useInfoNotification } from 'src/entities/info-notification'
import { socket } from 'src/shared/api'

export const useInfoNotificationUpdateMonitor = () => {
  const { bulkPut, put, update } = useInfoNotification()

  const actualizeInfoNotifications = async (notifications: EventGetInfoNotificationsType) => {
    await bulkPut(notifications)
  }

  const receiveInfoNotification = async (notification: EventInfoNotificationReceivedType) => {
    await put(notification)
  }

  const updateStatus = async ({ id, status }: IEventInfoNotificationStatusUpdated) => {
    await update(id, { status })
  }

  const initializeInfoNotificationUpdateMonitor = () => {
    socket.on<SocketActionsType>('actual-info-notifications', actualizeInfoNotifications)
    socket.on<SocketActionsType>('info-notification-received', receiveInfoNotification)
    socket.on<SocketActionsType>('info-notification-status-updated', updateStatus)
  }

  const disposeInfoNotificationUpdateMonitor = () => {
    socket.off<SocketActionsType>('actual-info-notifications', actualizeInfoNotifications)
    socket.off<SocketActionsType>('info-notification-received', receiveInfoNotification)
    socket.off<SocketActionsType>('info-notification-status-updated', updateStatus)
  }

  onBeforeUnmount(disposeInfoNotificationUpdateMonitor)

  return {
    initializeInfoNotificationUpdateMonitor,
    disposeInfoNotificationUpdateMonitor
  }
}
