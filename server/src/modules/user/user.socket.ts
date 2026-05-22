import type { Contact, EventGetContacts, EventGetRooms, SocketActions } from 'global-shared'

import type { PresenceService } from 'src/modules/presence/presence.service'
import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types/socket'

import { ChatRoomModel } from '../chat-rooms/chat-rooms.model'
import { resolveKnownUsers, transformRoomForUser } from '../chat-rooms/chat-rooms.service'

import type { UpdateLanguagePayload } from './types'
import { USER_SOCKET_I18N } from './user.i18n'
import { UserModel } from './user.model'
import { transformUserToFrontendContact } from './user.service'

export const registerUserSocketHandlers = (socket: SocketInstance, presenceService: PresenceService) => {
  socket.on<SocketActions>(
    'disconnect',
    socketErrorMiddleware(
      socket,
      async () => {
        await presenceService.markSocketDisconnected(socket)
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
        const { userId } = socket.data
        const data = await UserModel.findById(userId).lean()
        const contacts = data?.personal.contacts
        const contactResultData: Contact[] = contacts
          ? await transformUserToFrontendContact(contacts, presenceService)
          : []
        const roomIds = data?.personal.chatRooms ?? []
        const pinnedChatRoomIds = data?.personal.pinnedChatRoomIds ?? []
        const rooms = await ChatRoomModel.find({ _id: { $in: roomIds } }).lean()
        const knownUserIds = [...new Set(rooms.flatMap((room) => room.users.map(String)).filter((id) => id !== userId))]
        const knownUsers = await resolveKnownUsers(knownUserIds, presenceService)
        const contactsPayload: EventGetContacts = {
          contacts: contactResultData,
          knownUsers
        }
        const roomsResultData: EventGetRooms = await Promise.all(
          rooms.map((room) => transformRoomForUser({ userId, room, pinnedChatRoomIds }))
        )

        socket.emit<SocketActions>('actual-contacts', contactsPayload)
        socket.emit<SocketActions>('actual-chat-rooms', roomsResultData)
      },
      { basicError: USER_SOCKET_I18N.actualizeUserDataFailed }
    )
  )
}
