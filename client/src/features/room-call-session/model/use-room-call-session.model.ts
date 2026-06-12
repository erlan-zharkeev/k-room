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

export const useRoomCallSession = () => {
  const { emitSocketAction } = useSocketAction()
  const { isSocketOnlineActionAvailable } = useSocketAvailability()
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

  const sendRoomCallSignal = (payload: EventSendRoomCallSignal) => {
    if (!isSocketOnlineActionAvailable.value) return

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
