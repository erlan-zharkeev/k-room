import type { EventRoomCallSignalReceived } from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import { emitSocketEvent } from 'src/shared/lib/transport-meta'
import type { EmitServerToClientSocketEvent } from 'src/shared/types'

export const emitRoomCallSignalReceived = (socketId: string, payload: EventRoomCallSignalReceived) => {
  const room = getIO().to(socketId)
  const emit = room.emit.bind(room) as EmitServerToClientSocketEvent

  emitSocketEvent(emit, 'room-call-signal-received', payload)
}
