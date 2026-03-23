import { IEventStatusContact, SocketActionsType } from 'common-types'

import { UserModel } from 'entities/user'

import { getIO } from 'shared-lib'

import { getSocketsByUserIds } from './get-sockets-by-ids'

export const emitUserStatusToAll = async (interlocutorId: string, online: boolean, lastSeen?: number) => {
  const users = await UserModel.find(
    { [`personal.contacts.${interlocutorId}`]: { $exists: true } },
    { _id: 1 }
  ).lean()

  if (!users.length) return

  const userIds = users.map((user) => user._id)
  const sockets = await getSocketsByUserIds(userIds)
  const payload: IEventStatusContact = {
    interlocutorId,
    online,
    onlineStatusUpdatedTimestamp: Date.now(),
    lastSeen
  }

  sockets.forEach((socketId) => {
    getIO().to(socketId).emit<SocketActionsType>('contact-status-updated', payload)
  })
}
