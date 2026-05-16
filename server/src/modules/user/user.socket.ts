import type { ChatRoomsType, IFrontendContact, SocketActionsType } from 'global-shared'

import type { PresenceService } from 'src/modules/presence/presence.service'
import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { ChatRoomModel } from '../chat-rooms/chat-rooms.model'
import { transformRoomForUser } from '../chat-rooms/chat-rooms.service'

import type { IUpdateLanguagePayload } from './types'
import { USER_SOCKET_I18N } from './user.i18n'
import { UserModel } from './user.model'
import { transformUserToFrontendContact } from './user.service'

export const registerUserSocketHandlers = (socket: SocketInstanceType, presenceService: PresenceService) => {
  socket.on<SocketActionsType>(
    'disconnect',
    socketErrorMiddleware(
      socket,
      async () => {
        await presenceService.markSocketDisconnected(socket)
      },
      { basicError: USER_SOCKET_I18N.userDisconnectFailed }
    )
  )

  socket.on<SocketActionsType>(
    'update-language',
    socketErrorMiddleware(
      socket,
      async ({ language }: IUpdateLanguagePayload) => {
        socket.data.language = language
      },
      { basicError: USER_SOCKET_I18N.updateLanguageFailed }
    )
  )

  socket.on<SocketActionsType>(
    'actualize-user-data',
    socketErrorMiddleware(
      socket,
      async () => {
        const { userId } = socket.data
        const data = await UserModel.findById(userId).lean()
        const contacts = data?.personal.contacts
        const contactResultData: IFrontendContact[] = contacts
          ? await transformUserToFrontendContact(contacts, presenceService)
          : []
        const roomIds = data?.personal.chatRooms ?? []
        const rooms = await ChatRoomModel.find({ _id: { $in: roomIds } }).lean()
        const roomsResultData: ChatRoomsType = await Promise.all(
          rooms.map((room) => transformRoomForUser({ userId, room }))
        )

        socket.emit<SocketActionsType>('actual-contacts', contactResultData)
        socket.emit<SocketActionsType>('actual-chat-rooms', roomsResultData)
      },
      { basicError: USER_SOCKET_I18N.actualizeUserDataFailed }
    )
  )
}
