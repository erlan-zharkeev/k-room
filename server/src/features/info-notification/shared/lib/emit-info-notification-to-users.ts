import { IUserInfoNotification, SocketActionsType } from 'common'

import { getSocketsByUserIds } from 'src/features/user'

import { getIO } from 'src/shared/lib'

export const emitInfoNotificationToUsers = async ({
  userIds,
  notification
}: {
  userIds: string[]
  notification: IUserInfoNotification
}) => {
  if (!userIds.length) return

  const recipientSocketIds = await getSocketsByUserIds(userIds)

  recipientSocketIds.forEach((socketId) => {
    getIO().to(socketId).emit<SocketActionsType>('info-notification-received', notification)
  })
}
