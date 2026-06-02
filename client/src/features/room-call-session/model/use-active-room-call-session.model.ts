import { createGlobalState } from '@vueuse/core'
import {
  ROOM_CALL_LEAVE_REASON,
  ROOM_CALL_STATUS,
  type EventRoomCallSignalReceived,
  type RoomCall,
  type RoomCallAckFailureReason,
  type RoomCallMediaKind,
  type SocketAckFailure
} from 'global-shared'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useRoomCall } from 'src/entities/room-call'
import { useUser } from 'src/entities/user'
import { TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { ROOM_CALL_SESSION_I18N } from '../config/i18n'
import {
  resolveRoomCallJoinFailureMessage,
  resolveRoomCallStartFailureMessage
} from '../lib/resolve-room-call-session-failure-message'

import { useRoomCallLocalMedia } from './use-room-call-local-media.model'
import { useRoomCallPeerManager } from './use-room-call-peer-manager.model'
import { useRoomCallSession } from './use-room-call-session.model'
import { useRoomCallSignalMonitor } from './use-room-call-signal-monitor.model'

export const useActiveRoomCallSession = createGlobalState(() => {
  const activeRoomCallId = ref('')
  const isStartingRoomCall = ref(false)
  const isJoiningRoomCall = ref(false)
  const isLeavingRoomCall = ref(false)
  const { t } = useI18n()
  const toast = useAppToast()
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
    videoStream
  } = useRoomCallLocalMedia()
  const { joinRoomCall, leaveRoomCall, startRoomCall, updateRoomCallMediaState } = useRoomCallSession()
  const {
    connectRoomCallPeers,
    handleRoomCallSignalReceived,
    remoteStreamsByUserId,
    resetRoomCallPeers,
    syncRoomCallPeerTracks
  } = useRoomCallPeerManager()
  const publishedVideoStream = computed(() => screenStream.value || videoStream.value)
  const localStreams = computed(() => [audioStream.value, publishedVideoStream.value])
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

  const showRoomCallSessionError = (content: string) => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content
    })
  }

  const showRoomCallAckFailure = (response: SocketAckFailure<RoomCallAckFailureReason>, content: string) => {
    if (response.handledByGlobalError && !response.reason) {
      return
    }

    showRoomCallSessionError(content)
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

      const response = await startRoomCall(roomId, mediaKind)

      if (!response.ok) {
        stopRoomCallLocalMedia()
        showRoomCallAckFailure(response, t(resolveRoomCallStartFailureMessage(response.reason)))
        return null
      }

      const { roomCallId } = response.payload

      activeRoomCallId.value = roomCallId
      await syncActiveRoomCallLocalState()

      return roomCallId
    } catch {
      clearActiveRoomCallSessionState()
      showRoomCallSessionError(t(ROOM_CALL_SESSION_I18N.roomCallStartFailed))
      return null
    } finally {
      isStartingRoomCall.value = false
    }
  }

  const joinActiveRoomCall = async (roomCallId: string, mediaKind?: RoomCallMediaKind) => {
    isJoiningRoomCall.value = true

    try {
      const response = await joinRoomCall(roomCallId)

      if (!response.ok) {
        showRoomCallAckFailure(response, t(resolveRoomCallJoinFailureMessage(response.reason)))
        return null
      }

      const { roomCall } = response.payload
      const localMediaKind = mediaKind ?? roomCall.mediaKind

      await startRoomCallLocalMedia(localMediaKind)
      activeRoomCallId.value = roomCall.id
      await syncActiveRoomCallLocalState()
      await connectActiveRoomCallPeers(roomCall)

      return roomCall
    } catch {
      await leaveRoomCall(roomCallId, ROOM_CALL_LEAVE_REASON.LEFT)
      clearActiveRoomCallSessionState()
      showRoomCallSessionError(t(ROOM_CALL_SESSION_I18N.roomCallJoinFailed))
      return null
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
    if (!enabled || audioStream.value) {
      setAudioEnabled(enabled)
      return
    }

    try {
      await startAudio()
    } catch {
      showRoomCallSessionError(t(ROOM_CALL_SESSION_I18N.roomCallAudioStartFailed))
    }
  }

  const setActiveRoomCallVideoEnabled = async (enabled: boolean) => {
    if (!enabled || videoStream.value) {
      setVideoEnabled(enabled)
      return
    }

    try {
      await startVideo()
    } catch {
      showRoomCallSessionError(t(ROOM_CALL_SESSION_I18N.roomCallVideoStartFailed))
    }
  }

  const startActiveRoomCallScreen = async () => {
    try {
      await startScreen()
    } catch {
      showRoomCallSessionError(t(ROOM_CALL_SESSION_I18N.roomCallScreenStartFailed))
    }
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
    activeRoomCall,
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
    startActiveRoomCallScreen,
    stopActiveRoomCallScreen
  }
})
