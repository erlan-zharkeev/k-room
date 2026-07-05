import type { EventRoomCallSignalReceived } from 'global-shared'

export const createRoomCallSignalQueue = () => {
  const pendingSignalsByRoomCallId = new Map<string, EventRoomCallSignalReceived[]>()
  let joiningRoomCallId = ''

  const startJoiningRoomCall = (roomCallId: string) => {
    joiningRoomCallId = roomCallId
    pendingSignalsByRoomCallId.delete(roomCallId)
  }

  const stopJoiningRoomCall = (roomCallId: string) => {
    if (joiningRoomCallId === roomCallId) {
      joiningRoomCallId = ''
    }

    pendingSignalsByRoomCallId.delete(roomCallId)
  }

  const clearRoomCallSignalQueue = () => {
    joiningRoomCallId = ''
    pendingSignalsByRoomCallId.clear()
  }

  const queueJoiningRoomCallSignal = (payload: EventRoomCallSignalReceived) => {
    if (payload.roomCallId !== joiningRoomCallId) {
      return false
    }

    const signals = pendingSignalsByRoomCallId.get(payload.roomCallId) ?? []

    pendingSignalsByRoomCallId.set(payload.roomCallId, [...signals, payload])

    return true
  }

  const flushRoomCallSignals = (roomCallId: string) => {
    const signals = pendingSignalsByRoomCallId.get(roomCallId) ?? []

    pendingSignalsByRoomCallId.delete(roomCallId)

    return signals
  }

  return {
    clearRoomCallSignalQueue,
    flushRoomCallSignals,
    queueJoiningRoomCallSignal,
    startJoiningRoomCall,
    stopJoiningRoomCall
  }
}
