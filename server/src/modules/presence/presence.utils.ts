import type { SocketActionsType } from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import type { MongoIdType } from 'src/shared/types/mongo'

import { USER_SOCKET_ROOM_PREFIX } from './constants'

export const buildUserRoomName = (userId: MongoIdType | string) => `${USER_SOCKET_ROOM_PREFIX}:${String(userId)}`

export const emitToUsers = (userIds: Array<MongoIdType | string>, event: SocketActionsType, payload?: unknown) => {
  const io = getIO()

  userIds.forEach((userId) => {
    const room = io.to(buildUserRoomName(userId))

    if (payload === undefined) {
      room.emit<SocketActionsType>(event)
      return
    }

    room.emit<SocketActionsType>(event, payload)
  })
}
