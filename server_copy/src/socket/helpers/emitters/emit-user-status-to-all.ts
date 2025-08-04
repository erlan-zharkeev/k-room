import { io } from '../../../app/server'
import type { SocketActionsType, IEventStatusContact } from 'common-types'
import { getSocketsByUserIds } from '../getters'
import { UserModel } from 'entities/user'

export const emitUserStatusToAll = async (interlocutorId: string, online: boolean) => {
  const users = await UserModel.find({ [`contacts.${interlocutorId}`]: { $exists: true } })
  const userIds = users.map((user) => user.id)
  const sockets = await getSocketsByUserIds(userIds)
  const payload: IEventStatusContact = {
    interlocutorId,
    online,
    onlineStatusUpdatedTimestamp: Date.now()
  }
  sockets.forEach((socketId: string) => {
    io.to(socketId).emit<SocketActionsType>('contact-status-updated', payload)
  })
}
