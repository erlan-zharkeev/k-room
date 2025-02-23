import { transformRoomForUser } from '../../../utils'
import { getUserById } from '../getters'
import { ChatRoomSchemaType } from '../../../models/chat-room.model'

export const emitNewRoomToUsers = async (users: string[], room: ChatRoomSchemaType) => {
  users.forEach(async (userId) => {
    const userData = await getUserById(userId)
    if (!userData) return
    const transformedRoom = await transformRoomForUser({ userId, room })

    // io.to(userData.socketId).emit<SocketActions>('new-room-added', transformedRooms)
  })
}
