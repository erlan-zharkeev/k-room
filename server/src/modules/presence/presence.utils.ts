import type { ServerToClientSocketAction, ServerToClientSocketPayloadMap } from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import { emitSocketEvent } from 'src/shared/lib/transport-meta'
import type { EmitServerToClientSocketEvent, MongoId } from 'src/shared/types'

import { USER_SOCKET_ROOM_PREFIX } from './presence.constants'

export const buildUserRoomName = (userId: MongoId | string) => `${USER_SOCKET_ROOM_PREFIX}:${String(userId)}`

export const emitToUsers = <TEvent extends ServerToClientSocketAction>(
  userIds: Array<MongoId | string>,
  event: TEvent,
  ...payload: ServerToClientSocketPayloadMap[TEvent] extends void
    ? []
    : [payload: ServerToClientSocketPayloadMap[TEvent]]
) => {
  const io = getIO()

  userIds.forEach((userId) => {
    const room = io.to(buildUserRoomName(userId))
    const emit = room.emit.bind(room) as EmitServerToClientSocketEvent

    emitSocketEvent(emit, event, ...payload)
  })
}
