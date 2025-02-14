import { UserModel } from '../../../models'
import { io } from '../../../server'
import { SocketActions, EventStatusContact } from '../../../@types'
import { getSocketsByUserIds } from '../getters'

export const emitUserStatusToAll = async (interlocutorId: string, online: boolean) => {
  const users = await UserModel.find({ [`contacts.${interlocutorId}`]: { $exists: true } })
  const userIds = users.map((user) => user.id)
  const sockets = await getSocketsByUserIds(userIds)
  const payload: EventStatusContact = {
    interlocutorId,
    online,
    onlineStatusUpdatedTimestamp: Date.now()
  }
  sockets.forEach((socketId: string) => {
    io.to(socketId).emit<SocketActions>('status-contact', payload)
  })
}
