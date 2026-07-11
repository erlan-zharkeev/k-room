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

export const useRoomCallSession = () => {
  const { emitSocketAction } = useSocketAction()
  const { remove } = useRoomCall()

  const startRoomCall = async (roomId: string, mediaKind: RoomCallMediaKind) => {
    return emitSocketAction<'start-room-call', RoomCallAckFailureReason>('start-room-call', {
      mediaKind,
      roomId
    })
  }

  const joinRoomCall = async (roomCallId: string) => {
    return emitSocketAction<'join-room-call', RoomCallAckFailureReason>('join-room-call', {
      roomCallId
    })
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
    const response = await emitSocketAction('leave-room-call', {
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
      const response = await emitSocketAction('send-room-call-signal', payload, {
        showTransportErrorToast: false,
        timeoutMs: ROOM_CALL_SIGNAL_ACK_TIMEOUT_MS
      })

      if (response.ok) {
        return true
      }
    }

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
