import type { IMarkInfoNotificationAsReadPayload, SocketActionsType } from 'global-shared'

import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { INFO_NOTIFICATION_SHARED_I18N } from './info-notifications.i18n'
import { emitInfoNotificationStatusUpdated, updateInfoNotificationStateStatus } from './info-notifications.service'

export const registerInfoNotificationsSocketHandlers = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'mark-info-notification-as-read',
    socketErrorMiddleware(
      socket,
      async ({ id }: IMarkInfoNotificationAsReadPayload) => {
        const { userId } = socket.data

        await updateInfoNotificationStateStatus({
          userId,
          notificationId: id,
          status: 'read'
        })

        emitInfoNotificationStatusUpdated(socket.id, {
          id,
          status: 'read'
        })
      },
      { basicError: INFO_NOTIFICATION_SHARED_I18N.markAsReadFailed }
    )
  )
}
