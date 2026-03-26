import type { IChatRoomSchema, SocketActionsType } from 'common'

import { transformRoomForUser } from 'features/chat-room/~shared/lib/transform-room-for-user'
import { getSocketsByUserIds } from 'features/user'

import { UserModel } from 'entities/user'

import { getIO } from 'shared-lib'


export const emitNewRoomToUsers = async (userIds: string[], room: IChatRoomSchema) => {
  userIds.forEach(async (userId) => {
    const userData = await UserModel.findOne({ _id: userId }).lean()
    if (!userData) return
    const transformedRoom = transformRoomForUser({ userId, room })
    const sockets = await getSocketsByUserIds([userId])
    sockets.forEach((socketId) => {
      getIO().to(socketId).emit<SocketActionsType>('new-room-added', transformedRoom)
    })
  })
}
