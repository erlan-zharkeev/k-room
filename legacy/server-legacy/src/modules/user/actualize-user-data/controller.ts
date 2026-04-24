import { ChatRoomsType, IFrontendContact, SocketActionsType } from 'common'

import { transformRoomForUser } from 'src/modules/chat-room'
import { ChatRoomModel } from 'src/modules/chat-room'
import { getUserActiveInfoNotifications } from 'src/modules/info-notification'

import { SocketInstanceType } from 'src/shared/config'
import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { USER_SOCKET_I18N } from '../config/i18n'
import { getSocketsByUserIds } from '../shared/lib/get-sockets-by-ids'
import { UserModel } from '../user.model'

import { transformUserToFrontendContact } from './lib/transform-user-to-frontend-contact'

export const actualizeUserDataController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'actualize-user-data',
    socketErrorMiddleware(
      socket,
      async () => {
        const { userId } = socket.data
        const data = await UserModel.findById(userId).lean()
        const contacts = data?.personal.contacts
        let contactResultData: IFrontendContact[] = []
        if (contacts) {
          contactResultData = await transformUserToFrontendContact(contacts)
        }
        const roomIds = data?.personal.chatRooms
        const rooms = await ChatRoomModel.find({ _id: { $in: roomIds } }).lean()
        const roomsResultData: ChatRoomsType = rooms.map((room) => transformRoomForUser({ userId, room }))
        const infoNotifications = await getUserActiveInfoNotifications(userId, socket.data.language)
        const sockets = await getSocketsByUserIds([userId])
        sockets.forEach((socketId) => {
          getIO().to(socketId).emit<SocketActionsType>('actual-contacts', contactResultData)
          getIO().to(socketId).emit<SocketActionsType>('actual-chat-rooms', roomsResultData)
          getIO().to(socketId).emit<SocketActionsType>('actual-info-notifications', infoNotifications)
        })
      },
      { basicError: USER_SOCKET_I18N.actualizeUserDataFailed }
    )
  )
}
