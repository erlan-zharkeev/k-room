import { ROOM_CALL_STATUS, type RoomCallMediaKind } from 'global-shared'
import { computed } from 'vue'

import { useRoomCall } from 'src/entities/room-call'
import { useActiveRoomCallSession } from 'src/features/room-call-session'

import { useChatRoomMessageSelection } from './use-chat-room-message-selection.model'
import { useSelectedChatRoom } from './use-selected-chat-room.model'

export const useChatRoomContent = () => {
  const { selectedChatRoomId, selectedChatRoom, isSelectedChatRoomPrivate } = useSelectedChatRoom()
  const { roomCalls } = useRoomCall()
  const {
    activeRoomCall,
    activeRoomCallId,
    isJoiningRoomCall,
    isLeavingRoomCall,
    isRoomCallSessionBusy,
    isStartingRoomCall,
    joinActiveRoomCall,
    localMediaState,
    remoteStreamsByUserId,
    screenStream,
    setActiveRoomCallAudioEnabled,
    setActiveRoomCallVideoEnabled,
    startActiveRoomCall,
    startActiveRoomCallScreen,
    stopActiveRoomCallScreen,
    videoStream,
    leaveActiveRoomCall
  } = useActiveRoomCallSession()
  const { clearSelectedMessage, selectChatRoomMessage, selectCurrentChatRoomMessage, selectedMessageId } =
    useChatRoomMessageSelection(selectedChatRoomId)

  const activeSelectedRoomCall = computed(() =>
    roomCalls.value.find(({ finishedAt, roomId, status }) => {
      const belongsToSelectedRoom = roomId === selectedChatRoomId.value
      const hasFinishedAt = Boolean(finishedAt)
      const isFinishedStatus = status === ROOM_CALL_STATUS.FINISHED

      return belongsToSelectedRoom && !hasFinishedAt && !isFinishedStatus
    })
  )
  const isRoomCallStartDisabled = computed(() => {
    const hasActiveSession = Boolean(activeRoomCallId.value)
    const hasActiveSelectedRoomCall = Boolean(activeSelectedRoomCall.value)

    return isRoomCallSessionBusy.value || hasActiveSession || hasActiveSelectedRoomCall
  })
  const selectedActiveRoomCall = computed(() => {
    const belongsToSelectedRoom = activeRoomCall.value?.roomId === selectedChatRoomId.value

    return belongsToSelectedRoom ? activeRoomCall.value : undefined
  })
  const joinableSelectedRoomCall = computed(() => {
    if (selectedActiveRoomCall.value) {
      return undefined
    }

    return activeSelectedRoomCall.value
  })
  const isRoomCallJoinDisabled = computed(() => {
    const hasActiveSession = Boolean(activeRoomCallId.value)

    return isRoomCallSessionBusy.value || hasActiveSession
  })

  const startSelectedRoomCall = async (mediaKind: RoomCallMediaKind) => {
    const roomId = selectedChatRoomId.value

    if (!roomId || isRoomCallStartDisabled.value) {
      return null
    }

    return startActiveRoomCall(roomId, mediaKind)
  }
  const joinSelectedRoomCall = async () => {
    const roomCall = joinableSelectedRoomCall.value

    if (!roomCall || isRoomCallJoinDisabled.value) {
      return null
    }

    return joinActiveRoomCall(roomCall.id)
  }

  return {
    selectedChatRoomId,
    selectedChatRoom,
    isSelectedChatRoomPrivate,
    selectedMessageId,
    selectedActiveRoomCall,
    joinableSelectedRoomCall,
    videoStream,
    screenStream,
    remoteStreamsByUserId,
    localMediaState,
    isRoomCallStartDisabled,
    isStartingRoomCall,
    isJoiningRoomCall,
    isLeavingRoomCall,
    isRoomCallSessionBusy,
    isRoomCallJoinDisabled,
    clearSelectedMessage,
    selectChatRoomMessage,
    selectCurrentChatRoomMessage,
    setActiveRoomCallAudioEnabled,
    setActiveRoomCallVideoEnabled,
    startActiveRoomCallScreen,
    stopActiveRoomCallScreen,
    leaveActiveRoomCall,
    joinSelectedRoomCall,
    startSelectedRoomCall
  }
}
