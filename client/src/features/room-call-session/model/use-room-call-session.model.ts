import type {
  EventDeclineRoomCall,
  EventSendRoomCallSignal,
  RoomCallAckFailureReason,
  RoomCallLeaveReason,
  RoomCallMediaKind,
  RoomCallParticipantMediaState,
  RoomCallTemporaryQuickCommand
} from 'global-shared'

import { useRoomCall } from 'src/entities/room-call'
import { useSocketAction } from 'src/shared/api'

import { ROOM_CALL_SIGNAL_ACK_TIMEOUT_MS, ROOM_CALL_SIGNAL_SEND_ATTEMPTS } from '../config/constants'
import { buildRoomCallSignalDiagnostics, captureRoomCallDiagnostic } from '../lib/room-call-sentry-diagnostics'

export const useRoomCallSession = () => {
  const { emitSocketAction } = useSocketAction()
  const { remove } = useRoomCall()

  const startRoomCall = async (roomId: string, mediaKind: RoomCallMediaKind) => {
    captureRoomCallDiagnostic('socket-start-room-call-requested', {
      mediaKind,
      roomId
    })

    const response = await emitSocketAction<'start-room-call', RoomCallAckFailureReason>('start-room-call', {
      mediaKind,
      roomId
    })

    captureRoomCallDiagnostic(response.ok ? 'socket-start-room-call-succeeded' : 'socket-start-room-call-failed', {
      mediaKind,
      reason: response.ok ? undefined : response.reason,
      roomCallId: response.ok ? response.payload.roomCallId : undefined,
      roomId
    })

    return response
  }

  const joinRoomCall = async (roomCallId: string) => {
    captureRoomCallDiagnostic('socket-join-room-call-requested', {
      roomCallId
    })

    const response = await emitSocketAction<'join-room-call', RoomCallAckFailureReason>('join-room-call', {
      roomCallId
    })

    captureRoomCallDiagnostic(response.ok ? 'socket-join-room-call-succeeded' : 'socket-join-room-call-failed', {
      participantCount: response.ok ? response.payload.roomCall.participants.length : undefined,
      reason: response.ok ? undefined : response.reason,
      roomCallId
    })

    return response
  }

  const declineRoomCall = async (roomCallId: string) => {
    const payload: EventDeclineRoomCall = {
      roomCallId
    }

    const response = await emitSocketAction('decline-room-call', payload)

    if (response.ok) {
      await remove(roomCallId)
    }

    return response.ok
  }

  const leaveRoomCall = async (roomCallId: string, reason: RoomCallLeaveReason) => {
    captureRoomCallDiagnostic('socket-leave-room-call-requested', {
      reason,
      roomCallId
    })

    const response = await emitSocketAction('leave-room-call', {
      reason,
      roomCallId
    })

    captureRoomCallDiagnostic(response.ok ? 'socket-leave-room-call-succeeded' : 'socket-leave-room-call-failed', {
      reason,
      roomCallId
    })

    return response.ok
  }

  const updateRoomCallMediaState = async (roomCallId: string, mediaState: RoomCallParticipantMediaState) => {
    const response = await emitSocketAction('update-room-call-media-state', {
      mediaState,
      roomCallId
    })

    if (!response.ok) {
      captureRoomCallDiagnostic(
        'socket-media-state-update-failed',
        {
          mediaState,
          roomCallId
        },
        'warning'
      )
    }

    return response.ok
  }

  const sendRoomCallQuickCommand = async (roomCallId: string, quickCommand: RoomCallTemporaryQuickCommand) => {
    const response = await emitSocketAction('send-room-call-quick-command', {
      quickCommand,
      roomCallId
    })

    return response.ok
  }

  const setRoomCallHandRaised = async (roomCallId: string, handRaised: boolean) => {
    const response = await emitSocketAction('set-room-call-hand-raised', {
      handRaised,
      roomCallId
    })

    return response.ok
  }

  const sendRoomCallSignal = async (payload: EventSendRoomCallSignal) => {
    for (let attempt = 1; attempt <= ROOM_CALL_SIGNAL_SEND_ATTEMPTS; attempt += 1) {
      captureRoomCallDiagnostic('socket-room-call-signal-send-requested', {
        attempt,
        roomCallId: payload.roomCallId,
        signal: buildRoomCallSignalDiagnostics(payload.signal),
        signalId: payload.signalId,
        signalKind: payload.signalKind,
        toUserId: payload.toUserId
      })
      const response = await emitSocketAction('send-room-call-signal', payload, {
        showTransportErrorToast: false,
        timeoutMs: ROOM_CALL_SIGNAL_ACK_TIMEOUT_MS
      })

      if (response.ok) {
        captureRoomCallDiagnostic('socket-room-call-signal-delivered', {
          attempt,
          roomCallId: payload.roomCallId,
          signalId: payload.signalId,
          signalKind: payload.signalKind,
          toUserId: payload.toUserId
        })
        return true
      }

      captureRoomCallDiagnostic(
        'socket-room-call-signal-send-attempt-failed',
        {
          attempt,
          roomCallId: payload.roomCallId,
          signalId: payload.signalId,
          signalKind: payload.signalKind,
          toUserId: payload.toUserId
        },
        'warning'
      )
    }

    captureRoomCallDiagnostic(
      'socket-room-call-signal-delivery-failed',
      {
        attempts: ROOM_CALL_SIGNAL_SEND_ATTEMPTS,
        roomCallId: payload.roomCallId,
        signalId: payload.signalId,
        signalKind: payload.signalKind,
        toUserId: payload.toUserId
      },
      'error'
    )
    return false
  }

  return {
    startRoomCall,
    joinRoomCall,
    declineRoomCall,
    leaveRoomCall,
    updateRoomCallMediaState,
    sendRoomCallQuickCommand,
    setRoomCallHandRaised,
    sendRoomCallSignal
  }
}
