import type { RoomCallMediaKind } from 'global-shared'
import { computed, ref } from 'vue'

import { useActiveRoomCallSession } from 'src/features/room-call-session'

import { useChatRoomContentView } from './use-chat-room-content-view.model'
import { useChatRoomMessageSelection } from './use-chat-room-message-selection.model'
import { useSelectedChatRoom } from './use-selected-chat-room.model'

export const useChatRoomContent = () => {
  const roomCallLoadingMediaKind = ref<RoomCallMediaKind | null>(null)
  const { selectedChatRoomId, selectedChatRoom, isSelectedChatRoomPrivate } = useSelectedChatRoom()
  const {
    activeRoomCall,
    isLeavingRoomCall,
    isRoomCallSessionBusy,
    isStartingRoomCall,
    localMediaState,
    remoteStreamsByUserId: activeRoomCallRemoteStreamsByUserId,
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
  const hasSelectedRoomCall = computed(() => Boolean(activeSelectedRoomCall.value))
  const { changeChatRoomContentView, chatRoomContentView, isChatRoomTextView } =
    useChatRoomContentView(hasSelectedRoomCall)
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

  const startSelectedRoomCall = async (mediaKind: RoomCallMediaKind) => {
    const roomId = selectedChatRoomId.value

    if (!roomId) {
      return null
    }

    roomCallLoadingMediaKind.value = mediaKind

    try {
      return await startActiveRoomCall(roomId, mediaKind)
    } finally {
      roomCallLoadingMediaKind.value = null
    }
  }

  return {
    selectedChatRoomId,
    selectedChatRoom,
    isSelectedChatRoomPrivate,
    selectedMessageId,
    chatRoomContentView,
    hasSelectedRoomCall,
    isChatRoomTextView,
    selectedActiveRoomCall,
    joinableSelectedRoomCall,
    videoStream,
    screenStream,
    remoteStreamsByUserId: activeRoomCallRemoteStreamsByUserId,
    localMediaState,
    isRoomCallStartDisabled,
    isStartingRoomCall,
    roomCallLoadingMediaKind,
    isLeavingRoomCall,
    isRoomCallSessionBusy,
    clearSelectedMessage,
    changeChatRoomContentView,
    selectChatRoomMessage,
    selectCurrentChatRoomMessage,
    setActiveRoomCallAudioEnabled,
    setActiveRoomCallVideoEnabled,
    startActiveRoomCallScreen,
    stopActiveRoomCallScreen,
    leaveActiveRoomCall,
    startSelectedRoomCall
  }
}
