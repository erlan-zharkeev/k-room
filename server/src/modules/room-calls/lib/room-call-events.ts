import type { EventRoomCallSignalReceived } from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import type { EmitServerToClientSocketEvent } from 'src/shared/types'

export const emitRoomCallSignalReceived = (socketId: string, payload: EventRoomCallSignalReceived) => {
  const room = getIO().to(socketId)
  const emitSocketEvent = room.emit.bind(room) as EmitServerToClientSocketEvent

  emitSocketEvent('room-call-signal-received', payload)
}
