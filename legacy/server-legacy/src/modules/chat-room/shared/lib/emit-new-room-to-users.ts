import { IChatRoomSchema, SocketActions } from 'common'

import { getSocketsByUserIds } from 'src/modules/user'
import { UserModel } from 'src/modules/user'

import { getIO } from 'src/shared/lib/io'

import { transformRoomForUser } from './transform-room-for-user'

export const emitNewRoomToUsers = async (userIds: string[], room: IChatRoomSchema) => {
  userIds.forEach(async (userId) => {
    const userData = await UserModel.findOne({ _id: userId }).lean()
    if (!userData) return
    const transformedRoom = transformRoomForUser({ userId, room })
    const sockets = await getSocketsByUserIds([userId])
    sockets.forEach((socketId) => {
      getIO().to(socketId).emit<SocketActions>('new-room-added', transformedRoom)
    })
  })
}
