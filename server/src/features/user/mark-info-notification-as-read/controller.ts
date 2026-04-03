import { IMarkInfoNotificationAsReadPayload, SocketActionsType } from 'common'

import { updateInfoNotificationStateStatus } from 'src/entities/info-notification-state'

import { SocketInstanceType } from 'src/shared/config'
import { throwSocketError } from 'src/shared/lib'

export const markInfoAsReadController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('mark-info-notification-as-read', async ({ id }: IMarkInfoNotificationAsReadPayload) => {
    try {
      const { userId } = socket.data

      await updateInfoNotificationStateStatus({ userId, notificationId: id, status: 'read' })
    } catch {
      throwSocketError(socket.id)
    }
  })
}
