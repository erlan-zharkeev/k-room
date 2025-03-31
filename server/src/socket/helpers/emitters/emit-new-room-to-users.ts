import { IChatRoomSchema, SocketActionsType } from '../../../@types'
import { io } from '../../../server'
import { transformRoomForUser } from '../../../utils'
import { getUserById } from '../getters'

export const emitNewRoomToUsers = async (users: string[], room: IChatRoomSchema) => {
  users.forEach(async (userId) => {
    const userData = await getUserById(userId)
    if (!userData) return
    const transformedRooms = await transformRoomForUser({ userId, room })
    io.to(userData.socketId).emit<SocketActionsType>('new-room-added', transformedRooms)
  })
}
