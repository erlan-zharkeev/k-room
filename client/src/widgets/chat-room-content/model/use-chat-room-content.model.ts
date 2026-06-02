import type { RoomCallMediaKind } from 'global-shared'
import { computed } from 'vue'

import { useActiveRoomCallSession } from 'src/features/room-call-session'

import { useChatRoomMessageSelection } from './use-chat-room-message-selection.model'
import { useSelectedChatRoom } from './use-selected-chat-room.model'

export const useChatRoomContent = () => {
  const { selectedChatRoomId, selectedChatRoom, isSelectedChatRoomPrivate } = useSelectedChatRoom()
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
    canStartActiveRoomCall,
    resolveActiveRoomCallByRoomId,
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

  const activeSelectedRoomCall = computed(() => resolveActiveRoomCallByRoomId(selectedChatRoomId.value))
  const isRoomCallStartDisabled = computed(() => !canStartActiveRoomCall(selectedChatRoomId.value))
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

    if (!roomId) {
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
