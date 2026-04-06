import { IEventInfoNotificationStatusUpdated, IMarkInfoNotificationAsReadPayload, SocketActionsType } from 'common'

import { updateInfoNotificationStateStatus } from 'src/entities/info-notification-state'

import { SocketInstanceType } from 'src/shared/config'
import { getIO } from 'src/shared/lib'
import { socketErrorMiddleware } from 'src/shared/middleware'

import { INFO_NOTIFICATION_SHARED_I18N } from './../shared/config/i18n'

export const markInfoNotificationAsReadController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'mark-info-notification-as-read',
    socketErrorMiddleware(
      socket,
      async ({ id }: IMarkInfoNotificationAsReadPayload) => {
        const { userId } = socket.data

        await updateInfoNotificationStateStatus({ userId, notificationId: id, status: 'read' })

        getIO()
          .to(socket.id)
          .emit<SocketActionsType>('info-notification-status-updated', {
            id,
            status: 'read'
          } satisfies IEventInfoNotificationStatusUpdated)
      },
      { basicError: INFO_NOTIFICATION_SHARED_I18N.markAsReadFailed }
    )
  )
}
