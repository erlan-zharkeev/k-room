import type { EventRoomCallSignalReceived } from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import { buildTransportMeta } from 'src/shared/lib/transport-meta'

import { ROOM_CALL_SIGNAL_DELIVERY_ACK_TIMEOUT_MS } from '../room-calls.constants'

export const emitRoomCallSignalReceived = async (socketId: string, payload: EventRoomCallSignalReceived) => {
  try {
    const responses = await getIO()
      .timeout(ROOM_CALL_SIGNAL_DELIVERY_ACK_TIMEOUT_MS)
      .to(socketId)
      .emitWithAck('room-call-signal-received', payload, buildTransportMeta())

    return responses.includes(true)
  } catch (error) {
    const isDeliveryTimeout = error instanceof Error && error.message === 'operation has timed out'

    if (isDeliveryTimeout) return false

    throw error
  }
}
