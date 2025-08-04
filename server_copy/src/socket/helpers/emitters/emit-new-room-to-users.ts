import type { IChatRoomSchema, SocketActionsType } from 'common-types'
import { io } from '../../../app/server'
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
