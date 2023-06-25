import { io } from '../../../server'
import { SocketActions } from '../../../../../types'
import getSocketsByUserIds from '../getters/getSocketsByUserIds'
import { UserModel } from './../../../models/user.model'

export const emitUserStatusToAll = async (userId: string, status: boolean) => {
  const users = await UserModel.find({ contacts: { $in: userId } })
  const userIds = users.map((user) => user.id)
  const sockets = await getSocketsByUserIds(userIds)

  sockets.forEach((socketId: string) => {
    io.to(socketId).emit(SocketActions['status-contact'], { userId, status })
  })
}

export default emitUserStatusToAll
