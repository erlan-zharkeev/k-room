import { Injectable } from '@nestjs/common'
import type { EventUpdateLanguage } from 'global-shared'

import { PresenceService } from 'src/modules/presence/presence.service'
import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types/socket'

import { resolveActualUserSocketData } from './lib/resolve-actual-user-socket-data'
import { USER_SOCKET_I18N } from './user.i18n'

@Injectable()
export class UserSocketService {
  constructor(private readonly presenceService: PresenceService) {}

  register(socket: SocketInstance) {
    socket.on(
      'disconnect',
      socketErrorMiddleware(
        socket,
        async () => {
          await this.presenceService.markSocketDisconnected(socket)
        },
        { basicError: USER_SOCKET_I18N.userDisconnectFailed }
      )
    )

    socket.on(
      'update-language',
      socketErrorMiddleware<EventUpdateLanguage>(
        socket,
        async ({ language }) => {
          socket.data.language = language
        },
        { basicError: USER_SOCKET_I18N.updateLanguageFailed }
      )
    )

    socket.on(
      'actualize-user-data',
      socketErrorMiddleware(
        socket,
        async () => {
          const data = await resolveActualUserSocketData(socket.data.userId, this.presenceService)

          if (!data) {
            return
          }

          socket.emit('actual-contacts', data.contactsPayload)
          socket.emit('actual-chat-rooms', data.roomsPayload)
        },
        { basicError: USER_SOCKET_I18N.actualizeUserDataFailed }
      )
    )
  }
}
