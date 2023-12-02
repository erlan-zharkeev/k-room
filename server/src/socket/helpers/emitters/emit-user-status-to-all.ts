import { UserModel } from '../../../models'
import { io } from '../../../server'
import { SocketActionsPayload, SocketActions } from '../../../@types'
import { getSocketsByUserIds } from '../getters'

export const emitUserStatusToAll = async (interlocutorId: string, status: boolean) => {
  const users = await UserModel.find({ contacts: { $in: interlocutorId } })
  const userIds = users.map((user) => user.id)
  const sockets = await getSocketsByUserIds(userIds)
  const payload: SocketActionsPayload['statusContact'] = { interlocutorId, status }
  sockets.forEach((socketId: string) => {
    io.to(socketId).emit(SocketActions.STATUS_CONTACT, payload)
  })
}
