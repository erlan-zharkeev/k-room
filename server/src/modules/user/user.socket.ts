import { Injectable } from '@nestjs/common'
import { type SocketActions } from 'global-shared'

import { PresenceService } from 'src/modules/presence/presence.service'
import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types/socket'

import { resolveActualUserSocketData } from './lib/resolve-actual-user-socket-data'
import type { UpdateLanguagePayload } from './types'
import { USER_SOCKET_I18N } from './user.i18n'

@Injectable()
export class UserSocketService {
  constructor(private readonly presenceService: PresenceService) {}

  register(socket: SocketInstance) {
    socket.on<SocketActions>(
      'disconnect',
      socketErrorMiddleware(
        socket,
        async () => {
          await this.presenceService.markSocketDisconnected(socket)
        },
        { basicError: USER_SOCKET_I18N.userDisconnectFailed }
      )
    )

    socket.on<SocketActions>(
      'update-language',
      socketErrorMiddleware(
        socket,
        async ({ language }: UpdateLanguagePayload) => {
          socket.data.language = language
        },
        { basicError: USER_SOCKET_I18N.updateLanguageFailed }
      )
    )

    socket.on<SocketActions>(
      'actualize-user-data',
      socketErrorMiddleware(
        socket,
        async () => {
          const data = await resolveActualUserSocketData(socket.data.userId, this.presenceService)

          if (!data) {
            return
          }

          socket.emit<SocketActions>('actual-contacts', data.contactsPayload)
          socket.emit<SocketActions>('actual-chat-rooms', data.roomsPayload)
        },
        { basicError: USER_SOCKET_I18N.actualizeUserDataFailed }
      )
    )
  }
}
