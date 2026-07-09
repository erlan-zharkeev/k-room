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
import { socket, useSocketAction, useSocketAvailability } from 'src/shared/api'

import { buildRoomCallSignalDiagnostics, captureRoomCallDiagnostic } from '../lib/room-call-sentry-diagnostics'

export const useRoomCallSession = () => {
  const { emitSocketAction } = useSocketAction()
  const { isSocketOnlineActionAvailable } = useSocketAvailability()
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

  const sendRoomCallSignal = (payload: EventSendRoomCallSignal) => {
    if (!isSocketOnlineActionAvailable.value) {
      captureRoomCallDiagnostic(
        'socket-room-call-signal-skipped',
        {
          roomCallId: payload.roomCallId,
          signal: buildRoomCallSignalDiagnostics(payload.signal),
          signalKind: payload.signalKind,
          socketOnlineActionAvailable: isSocketOnlineActionAvailable.value,
          toUserId: payload.toUserId
        },
        'warning'
      )
      return
    }

    socket.emit('send-room-call-signal', payload)
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
