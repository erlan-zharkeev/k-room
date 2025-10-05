import type { IChatRoomSchema, SocketActionsType } from 'common-types'
import { UserModel } from 'entities/user'
import { getSocketsByUserIds } from 'features/user'
import { getIO } from 'shared-lib'

import { transformRoomForUser } from './transform-room-for-user'


export const emitNewRoomToUsers = async (userIds: string[], room: IChatRoomSchema) => {
  userIds.forEach(async (userId) => {
    const userData = await UserModel.findOne({ _id: userId }).lean()
    if (!userData) return
    const transformedRoom = await transformRoomForUser({ userId, room })
    const sockets = await getSocketsByUserIds([userId])
    sockets.forEach((socketId) => {
      getIO().to(socketId).emit<SocketActionsType>('new-room-added', transformedRoom)
    })
  })
}
