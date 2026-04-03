import { ChatRoomsType, IFrontendContact, SocketActionsType } from 'common'

import { transformRoomForUser } from 'src/features/chat-room'
import { getUserActiveInfoNotifications } from 'src/features/info-notification'

import { ChatRoomModel } from 'src/entities/chat-room'
import { UserModel } from 'src/entities/user'

import { SocketInstanceType } from 'src/shared/config'
import { getIO, throwSocketError } from 'src/shared/lib'

import { getSocketsByUserIds } from './../shared'
import { transformUserToFrontendContact } from './lib'

export const actualizeUserDataController = (socket: SocketInstanceType) => {
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
      const roomsResultData: ChatRoomsType = rooms.map((room) => transformRoomForUser({ userId, room }))
      const infoNotifications = await getUserActiveInfoNotifications(userId)
      const sockets = await getSocketsByUserIds([userId])
      sockets.forEach((socketId) => {
        getIO().to(socketId).emit<SocketActionsType>('actual-contacts', contactResultData)
        getIO().to(socketId).emit<SocketActionsType>('actual-chat-rooms', roomsResultData)
        getIO().to(socketId).emit<SocketActionsType>('actual-info-notifications', infoNotifications)
      })
    } catch {
      throwSocketError(socket.id)
    }
  })
}
