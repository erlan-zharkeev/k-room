import type { SocketActions } from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import type { MongoId } from 'src/shared/types/mongo'

import { USER_SOCKET_ROOM_PREFIX } from './constants'

export const buildUserRoomName = (userId: MongoId | string) => `${USER_SOCKET_ROOM_PREFIX}:${String(userId)}`

export const emitToUsers = (userIds: Array<MongoId | string>, event: SocketActions, payload?: unknown) => {
  const io = getIO()

  userIds.forEach((userId) => {
    const room = io.to(buildUserRoomName(userId))

    if (payload === undefined) {
      room.emit<SocketActions>(event)
      return
    }

    room.emit<SocketActions>(event, payload)
  })
}
