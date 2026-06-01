import { ROOM_CALL_LEAVE_REASON, type RoomCallMediaKind } from 'global-shared'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { useRoomCallLocalMedia } from './use-room-call-local-media.model'
import { useRoomCallSession } from './use-room-call-session.model'

export const useActiveRoomCallSession = () => {
  const activeRoomCallId = ref('')
  const isStartingRoomCall = ref(false)
  const isJoiningRoomCall = ref(false)
  const isLeavingRoomCall = ref(false)
  const {
    audioStream,
    isAudioLoading,
    isScreenLoading,
    isVideoLoading,
    localMediaState,
    screenStream,
    setAudioEnabled,
    setVideoEnabled,
    startAudio,
    startRoomCallLocalMedia,
    startScreen,
    startVideo,
    stopRoomCallLocalMedia,
    stopScreen,
    stopVideo,
    videoStream
  } = useRoomCallLocalMedia()
  const { joinRoomCall, leaveRoomCall, startRoomCall, updateRoomCallMediaState } = useRoomCallSession()
  const isRoomCallSessionBusy = computed(
    () =>
      isStartingRoomCall.value ||
      isJoiningRoomCall.value ||
      isLeavingRoomCall.value ||
      isAudioLoading.value ||
      isVideoLoading.value ||
      isScreenLoading.value
  )

  const syncActiveRoomCallMediaState = async () => {
    if (!activeRoomCallId.value) {
      return false
    }

    return updateRoomCallMediaState(activeRoomCallId.value, localMediaState.value)
  }

  const startActiveRoomCall = async (roomId: string, mediaKind: RoomCallMediaKind) => {
    isStartingRoomCall.value = true

    try {
      await startRoomCallLocalMedia(mediaKind)

      const roomCallId = await startRoomCall(roomId, mediaKind)

      if (!roomCallId) {
        stopRoomCallLocalMedia()
        return null
      }

      activeRoomCallId.value = roomCallId
      await syncActiveRoomCallMediaState()

      return roomCallId
    } catch (error) {
      activeRoomCallId.value = ''
      stopRoomCallLocalMedia()
      throw error
    } finally {
      isStartingRoomCall.value = false
    }
  }

  const joinActiveRoomCall = async (roomCallId: string) => {
    isJoiningRoomCall.value = true

    try {
      const roomCall = await joinRoomCall(roomCallId)

      if (!roomCall) {
        return null
      }

      await startRoomCallLocalMedia(roomCall.mediaKind)
      activeRoomCallId.value = roomCall.id
      await syncActiveRoomCallMediaState()

      return roomCall
    } catch (error) {
      await leaveRoomCall(roomCallId, ROOM_CALL_LEAVE_REASON.LEFT)
      activeRoomCallId.value = ''
      stopRoomCallLocalMedia()
      throw error
    } finally {
      isJoiningRoomCall.value = false
    }
  }

  const leaveActiveRoomCall = async (reason = ROOM_CALL_LEAVE_REASON.LEFT) => {
    const roomCallId = activeRoomCallId.value

    if (!roomCallId) {
      stopRoomCallLocalMedia()
      return false
    }

    isLeavingRoomCall.value = true

    try {
      return await leaveRoomCall(roomCallId, reason)
    } finally {
      activeRoomCallId.value = ''
      stopRoomCallLocalMedia()
      isLeavingRoomCall.value = false
    }
  }

  const setActiveRoomCallAudioEnabled = async (enabled: boolean) => {
    if (enabled && !audioStream.value) {
      await startAudio()
      return
    }

    setAudioEnabled(enabled)
  }

  const setActiveRoomCallVideoEnabled = async (enabled: boolean) => {
    if (enabled && !videoStream.value) {
      await startVideo()
      return
    }

    setVideoEnabled(enabled)
  }

  const stopActiveRoomCallVideo = () => {
    stopVideo()
  }

  const startActiveRoomCallScreen = async () => {
    await startScreen()
  }

  const stopActiveRoomCallScreen = () => {
    stopScreen()
  }

  watch(localMediaState, () => {
    void syncActiveRoomCallMediaState()
  })

  onBeforeUnmount(() => {
    void leaveActiveRoomCall()
  })

  return {
    activeRoomCallId,
    audioStream,
    videoStream,
    screenStream,
    localMediaState,
    isStartingRoomCall,
    isJoiningRoomCall,
    isLeavingRoomCall,
    isRoomCallSessionBusy,
    startActiveRoomCall,
    joinActiveRoomCall,
    leaveActiveRoomCall,
    setActiveRoomCallAudioEnabled,
    setActiveRoomCallVideoEnabled,
    stopActiveRoomCallVideo,
    startActiveRoomCallScreen,
    stopActiveRoomCallScreen,
    syncActiveRoomCallMediaState
  }
}
