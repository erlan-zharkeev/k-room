import {
  ROOM_CALL_LEAVE_REASON,
  ROOM_CALL_STATUS,
  type EventRoomCallSignalReceived,
  type RoomCall,
  type RoomCallMediaKind
} from 'global-shared'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useRoomCall } from 'src/entities/room-call'
import { useUser } from 'src/entities/user'

import { useRoomCallLocalMedia } from './use-room-call-local-media.model'
import { useRoomCallPeerManager } from './use-room-call-peer-manager.model'
import { useRoomCallSession } from './use-room-call-session.model'
import { useRoomCallSignalMonitor } from './use-room-call-signal-monitor.model'

export const useActiveRoomCallSession = () => {
  const activeRoomCallId = ref('')
  const isStartingRoomCall = ref(false)
  const isJoiningRoomCall = ref(false)
  const isLeavingRoomCall = ref(false)
  const { roomCalls } = useRoomCall()
  const { user } = useUser()
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
  const {
    closeRoomCallPeer,
    connectRoomCallPeers,
    handleRoomCallSignalReceived,
    remoteStreamsByUserId,
    resetRoomCallPeers,
    syncRoomCallPeerTracks
  } = useRoomCallPeerManager()
  const localStreams = computed(() => [audioStream.value, videoStream.value, screenStream.value])
  const activeRoomCall = computed(() => roomCalls.value.find(({ id }) => id === activeRoomCallId.value))
  const activeRoomCallPeerParticipantKey = computed(
    () =>
      activeRoomCall.value?.participants
        .map(({ joinedAt, leftAt, socketId, userId }) => [userId, socketId, joinedAt, leftAt].join(':'))
        .join('|') ?? ''
  )
  const activeRoomCallFinished = computed(() => {
    const isFinishedStatus = activeRoomCall.value?.status === ROOM_CALL_STATUS.FINISHED
    const hasFinishedAt = Boolean(activeRoomCall.value?.finishedAt)

    return isFinishedStatus || hasFinishedAt
  })
  const isRoomCallSessionBusy = computed(
    () =>
      isStartingRoomCall.value ||
      isJoiningRoomCall.value ||
      isLeavingRoomCall.value ||
      isAudioLoading.value ||
      isVideoLoading.value ||
      isScreenLoading.value
  )

  const clearActiveRoomCallSessionState = () => {
    activeRoomCallId.value = ''
    resetRoomCallPeers()
    stopRoomCallLocalMedia()
  }

  const syncActiveRoomCallMediaState = async () => {
    if (!activeRoomCallId.value) {
      return false
    }

    return updateRoomCallMediaState(activeRoomCallId.value, localMediaState.value)
  }

  const syncActiveRoomCallPeerTracks = async () => {
    if (!activeRoomCallId.value) {
      return
    }

    await syncRoomCallPeerTracks(activeRoomCallId.value, localStreams.value)
  }

  const syncActiveRoomCallLocalState = async () => {
    await Promise.all([syncActiveRoomCallMediaState(), syncActiveRoomCallPeerTracks()])
  }

  const connectActiveRoomCallPeers = async (roomCall?: RoomCall) => {
    const targetRoomCall = roomCall ?? activeRoomCall.value
    const currentUserId = user.value.id

    if (!targetRoomCall || !currentUserId) {
      return false
    }

    await connectRoomCallPeers({
      currentUserId,
      localStreams: localStreams.value,
      participants: targetRoomCall.participants,
      roomCallId: targetRoomCall.id
    })

    return true
  }

  const handleActiveRoomCallSignalReceived = async (payload: EventRoomCallSignalReceived) => {
    await handleRoomCallSignalReceived(payload, activeRoomCallId.value, localStreams.value)
  }

  const { disposeRoomCallSignalMonitor, initializeRoomCallSignalMonitor } = useRoomCallSignalMonitor(
    handleActiveRoomCallSignalReceived
  )

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
      await syncActiveRoomCallLocalState()

      return roomCallId
    } catch (error) {
      clearActiveRoomCallSessionState()
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
      await syncActiveRoomCallLocalState()
      await connectActiveRoomCallPeers(roomCall)

      return roomCall
    } catch (error) {
      await leaveRoomCall(roomCallId, ROOM_CALL_LEAVE_REASON.LEFT)
      clearActiveRoomCallSessionState()
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
      clearActiveRoomCallSessionState()
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
    void syncActiveRoomCallLocalState()
  })

  watch(activeRoomCallPeerParticipantKey, () => {
    void connectActiveRoomCallPeers()
  })

  watch(activeRoomCallFinished, (isFinished) => {
    if (isFinished) {
      clearActiveRoomCallSessionState()
    }
  })

  onMounted(() => {
    initializeRoomCallSignalMonitor()
  })

  onBeforeUnmount(() => {
    disposeRoomCallSignalMonitor()
    void leaveActiveRoomCall()
  })

  return {
    activeRoomCallId,
    audioStream,
    videoStream,
    screenStream,
    remoteStreamsByUserId,
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
    closeRoomCallPeer,
    connectActiveRoomCallPeers,
    syncActiveRoomCallMediaState
  }
}
