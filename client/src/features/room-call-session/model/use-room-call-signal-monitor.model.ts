import type { EventRoomCallSignalReceived } from 'global-shared'

import { registerSocketAckEventListeners } from 'src/shared/api'

import { ROOM_CALL_HANDLED_SIGNAL_ID_LIMIT } from '../config/constants'
import type { HandleRoomCallSignalReceived } from '../config/types'
import {
  buildRoomCallErrorDiagnostics,
  buildRoomCallSignalDiagnostics,
  captureRoomCallDiagnostic
} from '../lib/room-call-sentry-diagnostics'

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
      captureRoomCallDiagnostic(
        'active-session-signal-processing-failed',
        {
          error: buildRoomCallErrorDiagnostics(error),
          fromUserId: payload.fromUserId,
          roomCallId: payload.roomCallId,
          signal: buildRoomCallSignalDiagnostics(payload.signal),
          signalId: payload.signalId,
          signalKind: payload.signalKind
        },
        'error'
      )
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
