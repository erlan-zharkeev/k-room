import { IEventInfoNotificationStatusUpdated, IMarkInfoNotificationAsReadPayload, SocketActionsType } from 'common'

import { SocketInstanceType } from 'src/shared/config'
import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { updateInfoNotificationStateStatus } from '../shared/lib/update-info-notification-state-status'

import { INFO_NOTIFICATION_SHARED_I18N } from './../shared/i18n'

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
