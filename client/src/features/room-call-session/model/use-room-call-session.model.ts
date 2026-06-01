import type {
  EventSendRoomCallSignal,
  RoomCallLeaveReason,
  RoomCallMediaKind,
  RoomCallParticipantMediaState
} from 'global-shared'

import { socket, useSocketAction } from 'src/shared/api'

export const useRoomCallSession = () => {
  const { emitSocketAction } = useSocketAction()

  const startRoomCall = async (roomId: string, mediaKind: RoomCallMediaKind) => {
    const response = await emitSocketAction('start-room-call', {
      mediaKind,
      roomId
    })

    return response.ok ? response.payload.roomCallId : null
  }

  const joinRoomCall = async (roomCallId: string) => {
    const response = await emitSocketAction('join-room-call', {
      roomCallId
    })

    return response.ok ? response.payload.roomCall : null
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

  const sendRoomCallSignal = (payload: EventSendRoomCallSignal) => {
    socket.emit('send-room-call-signal', payload)
  }

  return {
    startRoomCall,
    joinRoomCall,
    leaveRoomCall,
    updateRoomCallMediaState,
    sendRoomCallSignal
  }
}
