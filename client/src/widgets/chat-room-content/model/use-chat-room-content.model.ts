import { type RoomCallMediaKind } from 'global-shared'
import { computed, ref } from 'vue'

import { isRoomSupport } from 'src/entities/chat-room'
import { useActiveRoomCallSession } from 'src/features/room-call-session'

import { useChatRoomContentView } from './use-chat-room-content-view.model'
import { useChatRoomMessageSelection } from './use-chat-room-message-selection.model'
import { useSelectedChatRoom } from './use-selected-chat-room.model'

export const useChatRoomContent = () => {
  const roomCallLoadingMediaKind = ref<RoomCallMediaKind | null>(null)
  const { selectedChatRoomId, selectedChatRoom, isSelectedChatRoomFavorites, isSelectedChatRoomPrivate } =
    useSelectedChatRoom()
  const {
    activeRoomCall,
    audioStream,
    connectionQualityByUserId,
    handRaisedByUserId,
    isLeavingRoomCall,
    isRoomCallSessionBusy,
    isStartingRoomCall,
    localMediaState,
    remoteStreamsByUserId: activeRoomCallRemoteStreamsByUserId,
    canStartActiveRoomCall,
    resolveActiveRoomCallByRoomId,
    screenStream,
    sendActiveRoomCallQuickCommand,
    setActiveRoomCallAudioEnabled,
    setActiveRoomCallHandRaised,
    setActiveRoomCallVideoEnabled,
    startActiveRoomCall,
    startActiveRoomCallScreen,
    stopActiveRoomCallScreen,
    temporaryQuickCommandByUserId,
    videoFacingMode,
    videoStream,
    leaveActiveRoomCall
  } = useActiveRoomCallSession()
  const { clearSelectedMessage, selectChatRoomMessage, selectCurrentChatRoomMessage, selectedMessageId } =
    useChatRoomMessageSelection(selectedChatRoomId)

  const activeSelectedRoomCall = computed(() => resolveActiveRoomCallByRoomId(selectedChatRoomId.value))
  const hasSelectedRoomCall = computed(() => Boolean(activeSelectedRoomCall.value))
  const { changeChatRoomContentView, chatRoomContentView, isChatRoomTextView } =
    useChatRoomContentView(hasSelectedRoomCall)
  const isRoomCallAvailable = computed(
    () => !isSelectedChatRoomFavorites.value && !isRoomSupport(selectedChatRoom.value)
  )
  const isRoomCallStartDisabled = computed(
    () => !isRoomCallAvailable.value || !canStartActiveRoomCall(selectedChatRoomId.value)
  )
  const selectedActiveRoomCall = computed(() => {
    const belongsToSelectedRoom = activeRoomCall.value?.roomId === selectedChatRoomId.value
    const isActiveRoomCallInProgress = activeRoomCall.value?.status === 'in-progress'

    return belongsToSelectedRoom && isActiveRoomCallInProgress ? activeRoomCall.value : undefined
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
    isRoomCallAvailable,
    isSelectedChatRoomPrivate,
    selectedMessageId,
    chatRoomContentView,
    hasSelectedRoomCall,
    isChatRoomTextView,
    selectedActiveRoomCall,
    joinableSelectedRoomCall,
    audioStream,
    videoStream,
    videoFacingMode,
    screenStream,
    connectionQualityByUserId,
    remoteStreamsByUserId: activeRoomCallRemoteStreamsByUserId,
    handRaisedByUserId,
    temporaryQuickCommandByUserId,
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
    sendActiveRoomCallQuickCommand,
    setActiveRoomCallAudioEnabled,
    setActiveRoomCallHandRaised,
    setActiveRoomCallVideoEnabled,
    startActiveRoomCallScreen,
    stopActiveRoomCallScreen,
    leaveActiveRoomCall,
    startSelectedRoomCall
  }
}
