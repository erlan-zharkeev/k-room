import type { ChatRoomsType, IFrontendContact, SocketActionsType } from 'global-shared'

import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { ChatRoomModel } from '../chat-rooms/chat-rooms.model'
import { transformRoomForUser } from '../chat-rooms/chat-rooms.service'

import type { IUpdateLanguagePayload } from './types'
import { USER_SOCKET_I18N } from './user.i18n'
import { UserModel } from './user.model'
import { setLastSeenData, setUserStatus, transformUserToFrontendContact } from './user.service'

export const registerUserSocketHandlers = (socket: SocketInstanceType) => {
  void socketErrorMiddleware(
    socket,
    async () => {
      await setUserStatus(socket.data.userId, true)
    },
    { basicError: USER_SOCKET_I18N.userConnectFailed }
  )()

  socket.on<SocketActionsType>(
    'disconnect',
    socketErrorMiddleware(
      socket,
      async () => {
        const lastSeen = await setLastSeenData(socket.data.userId)
        await setUserStatus(socket.data.userId, false, lastSeen)
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
        const contactResultData: IFrontendContact[] = contacts ? await transformUserToFrontendContact(contacts) : []
        const roomIds = data?.personal.chatRooms ?? []
        const rooms = await ChatRoomModel.find({ _id: { $in: roomIds } }).lean()
        const roomsResultData: ChatRoomsType = rooms.map((room) => transformRoomForUser({ userId, room }))

        socket.emit<SocketActionsType>('actual-contacts', contactResultData)
        socket.emit<SocketActionsType>('actual-chat-rooms', roomsResultData)
      },
      { basicError: USER_SOCKET_I18N.actualizeUserDataFailed }
    )
  )
}
