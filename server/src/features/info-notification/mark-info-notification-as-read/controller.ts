import { IEventInfoNotificationStatusUpdated, IMarkInfoNotificationAsReadPayload, SocketActionsType } from 'common'

import { updateInfoNotificationStateStatus } from 'src/entities/info-notification-state'

import { SocketInstanceType } from 'src/shared/config'
import { getIO, throwSocketError } from 'src/shared/lib'

export const markInfoNotificationAsReadController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('mark-info-notification-as-read', async ({ id }: IMarkInfoNotificationAsReadPayload) => {
    try {
      const { userId } = socket.data

      await updateInfoNotificationStateStatus({ userId, notificationId: id, status: 'read' })

      getIO().to(socket.id).emit<SocketActionsType>('info-notification-status-updated', {
        id,
        status: 'read'
      } satisfies IEventInfoNotificationStatusUpdated)
    } catch {
      throwSocketError(socket.id)
    }
  })
}
