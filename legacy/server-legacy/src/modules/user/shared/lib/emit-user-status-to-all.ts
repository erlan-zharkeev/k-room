import { EventStatusContact, SocketActions } from 'common'

import { getIO } from 'src/shared/lib/io'

import { UserModel } from '../../user.model'

import { getSocketsByUserIds } from './get-sockets-by-ids'

export const emitUserStatusToAll = async (interlocutorId: string, online: boolean, lastSeen?: number) => {
  const users = await UserModel.find({ [`personal.contacts.${interlocutorId}`]: { $exists: true } }, { _id: 1 }).lean()

  if (!users.length) return

  const userIds = users.map((user) => user._id)
  const sockets = await getSocketsByUserIds(userIds)
  const payload: EventStatusContact = {
    interlocutorId,
    online,
    onlineStatusUpdatedTimestamp: Date.now(),
    lastSeen
  }

  sockets.forEach((socketId) => {
    getIO().to(socketId).emit<SocketActions>('contact-status-updated', payload)
  })
}
