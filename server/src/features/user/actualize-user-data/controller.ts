import { ChatRoomsType, IFrontendContact, SocketActionsType } from 'common-types'
import { ChatRoomModel } from 'entities/chat-room'
import { MessageModel } from 'entities/message'
import { UserModel } from 'entities/user'
import { getSocketsByUserIds } from 'features/user'
import { SocketInstanceType } from 'shared-config'
import { getIO, throwSocketError } from 'shared-lib'

import { transformRoomForUser } from '../../chat-room/~shared'
import { transformUserToFrontendContact } from './lib'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('actualize-user-data', async () => {
    const { userId } = socket.data
    try {
      const data = await UserModel.findById(userId).lean()
      const contacts = data?.personal.contacts
      let contactResultData: IFrontendContact[] = []
      if (contacts) {
        contactResultData = await transformUserToFrontendContact(contacts)
      }
      const roomIds = data?.personal.chatRooms
      const rooms = await ChatRoomModel.find({ _id: { $in: roomIds } }).lean()
      const roomsResultData: ChatRoomsType = rooms.map(room => transformRoomForUser({ userId, room }))
      const messageIds = roomsResultData.map((roomData) => roomData.messages).flat()
      const messagesResultData = (
        await MessageModel
          .find({ _id: { $in: messageIds } })
          .select('-__v')
          .lean()
      ).map(({ _id, ...rest }) => ({
        id: _id.toString(),
        ...rest,
      }))
      const sockets = await getSocketsByUserIds([userId])
      sockets.forEach(socketId => {
        getIO().to(socketId).emit<SocketActionsType>('actual-contacts', contactResultData)
        getIO().to(socketId).emit<SocketActionsType>('actual-chat-rooms', roomsResultData)
        getIO().to(socketId).emit<SocketActionsType>('actual-messages', messagesResultData)
      })
    } catch {
      throwSocketError(socket.id)
    }
  })
}