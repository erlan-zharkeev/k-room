import type { EventRoomCallSignalReceived } from 'global-shared'

import { registerSocketAckEventListeners } from 'src/shared/api'
import { log } from 'src/shared/lib'

import { ROOM_CALL_HANDLED_SIGNAL_ID_LIMIT } from '../config/constants'
import type { HandleRoomCallSignalReceived } from '../config/types'

export const useRoomCallSignalMonitor = (handleRoomCallSignalReceived: HandleRoomCallSignalReceived) => {
  let disposeRoomCallSignalMonitorListeners: (() => void) | null = null
  const handledSignalIds = new Set<string>()
  const pendingSignalTaskById = new Map<string, Promise<void>>()

  const rememberHandledSignalId = (signalId: string) => {
    handledSignalIds.add(signalId)

    if (handledSignalIds.size > ROOM_CALL_HANDLED_SIGNAL_ID_LIMIT) {
      const [oldestSignalId] = handledSignalIds

      if (oldestSignalId) {
        handledSignalIds.delete(oldestSignalId)
      }
    }
  }

  const handleReliableRoomCallSignalReceived = (payload: EventRoomCallSignalReceived) => {
    if (handledSignalIds.has(payload.signalId)) {
      return Promise.resolve()
    }

    if (pendingSignalTaskById.has(payload.signalId)) {
      return Promise.resolve()
    }

    const task = Promise.resolve(handleRoomCallSignalReceived(payload))
      .then(() => {
        rememberHandledSignalId(payload.signalId)
      })
      .finally(() => {
        pendingSignalTaskById.delete(payload.signalId)
      })

    pendingSignalTaskById.set(payload.signalId, task)
    void task.catch((error) => {
      log('error', 'Room call signal processing failed', {
        error,
        roomCallId: payload.roomCallId,
        signalId: payload.signalId,
        signalKind: payload.signalKind
      })
    })

    return Promise.resolve()
  }

  const initializeRoomCallSignalMonitor = () => {
    disposeRoomCallSignalMonitorListeners = registerSocketAckEventListeners([
      ['room-call-signal-received', handleReliableRoomCallSignalReceived]
    ])
  }

  const disposeRoomCallSignalMonitor = () => {
    disposeRoomCallSignalMonitorListeners?.()
    disposeRoomCallSignalMonitorListeners = null
    handledSignalIds.clear()
    pendingSignalTaskById.clear()
  }

  return {
    initializeRoomCallSignalMonitor,
    disposeRoomCallSignalMonitor
  }
}
