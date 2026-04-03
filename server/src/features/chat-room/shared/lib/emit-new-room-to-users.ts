import { IChatRoomSchema, SocketActionsType } from 'common'

import { getSocketsByUserIds } from 'src/features/user'

import { UserModel } from 'src/entities/user'

import { getIO } from 'src/shared/lib'

import { transformRoomForUser } from './index'

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
