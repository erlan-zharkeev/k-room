import { createGlobalState } from '@vueuse/core'
import {
  type EventRoomCallSignalReceived,
  type RoomCall,
  type RoomCallAckFailureReason,
  type RoomCallLeaveReason,
  type RoomCallMediaKind,
  type RoomCallTemporaryQuickCommand,
  type SocketAckFailure
} from 'global-shared'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useRoomCall } from 'src/entities/room-call'
import { useAppSound, useSettings } from 'src/entities/setting'
import { useSystem } from 'src/entities/system'
import { useUser } from 'src/entities/user'
import { API_I18N } from 'src/shared/api'
import { type AppSoundKind, log, TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { ROOM_CALL_SESSION_I18N } from '../config/i18n'
import { resolveWorstRoomCallConnectionQuality } from '../lib/resolve-room-call-connection-quality'
import { resolveRoomCallJoinMediaKind } from '../lib/resolve-room-call-join-media-kind'
import { isRoomCallBlockingStartForUser, isRoomCallUnfinished } from '../lib/room-call-start-availability'

import { useRoomCallLocalMedia } from './use-room-call-local-media.model'
import { useRoomCallPeerManager } from './use-room-call-peer-manager.model'
import { useRoomCallQuickCommandMonitor } from './use-room-call-quick-command-monitor.model'
import { useRoomCallQuickCommandSync } from './use-room-call-quick-command-sync.model'
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
  const { settings } = useSettings()
  const { hasInteracted } = useSystem()
  const { playAppSound, startLoopAppSound, stopAppSound } = useAppSound()
  const { user } = useUser()
  let outgoingRoomCallSoundRoomCallId = ''
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
  const {
    joinRoomCall,
    leaveRoomCall,
    sendRoomCallQuickCommand,
    setRoomCallHandRaised,
    startRoomCall,
    updateRoomCallMediaState
  } = useRoomCallSession()
  const {
    connectionQualityByUserId: peerConnectionQualityByUserId,
    connectRoomCallPeers,
    handleRoomCallSignalReceived,
    remoteStreamsByUserId,
    resetRoomCallPeers,
    syncRoomCallPeerTracks
  } = useRoomCallPeerManager()
  const {
    handRaisedByUserId,
    resetRoomCallQuickCommands,
    syncInitialRoomCallParticipantQuickCommandStates,
    syncRoomCallHandRaisedUpdated,
    syncRoomCallQuickCommandReceived,
    temporaryQuickCommandByUserId
  } = useRoomCallQuickCommandSync(activeRoomCallId)
  const localStreams = computed(() => [audioStream.value, videoStream.value, screenStream.value])
  const activeRoomCall = computed(() => roomCalls.value.find(({ id }) => id === activeRoomCallId.value))
  const localConnectionQuality = computed(() =>
    resolveWorstRoomCallConnectionQuality(Object.values(peerConnectionQualityByUserId.value))
  )
  const connectionQualityByUserId = computed(() => {
    const quality = localConnectionQuality.value

    if (!quality) {
      return peerConnectionQualityByUserId.value
    }

    return {
      ...peerConnectionQualityByUserId.value,
      [user.value.id]: quality
    }
  })
  const activeRoomCallStatus = computed(() => activeRoomCall.value?.status)
  const isActiveRoomCallScreenSharingByAnotherParticipant = computed(() =>
    Boolean(
      activeRoomCall.value?.participants.some(({ leftAt, mediaState, userId }) => {
        const isActiveParticipant = !leftAt
        const isAnotherParticipant = userId !== user.value.id
        const hasScreenSharing = mediaState.screen
        const hasActiveScreenSharing = isActiveParticipant && hasScreenSharing

        return hasActiveScreenSharing && isAnotherParticipant
      })
    )
  )
  const activeRoomCallPeerParticipantKey = computed(
    () =>
      activeRoomCall.value?.participants
        .map(({ joinedAt, leftAt, socketId, userId }) => [userId, socketId, joinedAt, leftAt].join(':'))
        .join('|') ?? ''
  )
  const activeRoomCallFinished = computed(() => {
    const isFinishedStatus = activeRoomCall.value?.status === 'finished'
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
  const hasBlockingUserRoomCall = computed(() =>
    roomCalls.value.some((roomCall) => isRoomCallBlockingStartForUser(roomCall, user.value.id))
  )
  const resolveActiveRoomCallByRoomId = (roomId: string) =>
    roomCalls.value.find((roomCall) => {
      const { roomId: activeRoomId } = roomCall
      const belongsToRoom = activeRoomId === roomId

      return belongsToRoom && isRoomCallUnfinished(roomCall)
    })

  const canStartActiveRoomCall = (roomId: string) => {
    const hasRoomId = Boolean(roomId)
    const hasActiveSession = Boolean(activeRoomCallId.value)
    const hasActiveRoomCall = Boolean(resolveActiveRoomCallByRoomId(roomId))
    const isRoomCallActionLocked =
      !hasRoomId ||
      hasActiveSession ||
      hasActiveRoomCall ||
      hasBlockingUserRoomCall.value ||
      isRoomCallSessionBusy.value

    return !isRoomCallActionLocked
  }

  const canPlayRoomCallSound = () => {
    const { calls, enabled, general } = settings.value.notifications

    return hasInteracted.value && enabled && general.sound && calls.sound
  }

  const stopOutgoingRoomCallSound = () => {
    stopAppSound('outgoing-call')
    outgoingRoomCallSoundRoomCallId = ''
  }

  const playRoomCallSound = async (kind: AppSoundKind) => {
    if (!canPlayRoomCallSound()) return

    try {
      await playAppSound(kind)
    } catch (error) {
      void error
    }
  }

  const startOutgoingRoomCallSound = async (roomCallId: string) => {
    if (!canPlayRoomCallSound()) return

    stopOutgoingRoomCallSound()
    outgoingRoomCallSoundRoomCallId = roomCallId

    try {
      await startLoopAppSound('outgoing-call')
      const isCurrentOutgoingRoomCallSound = outgoingRoomCallSoundRoomCallId === roomCallId

      if (!isCurrentOutgoingRoomCallSound) {
        if (!outgoingRoomCallSoundRoomCallId) {
          stopAppSound('outgoing-call')
        }

        return
      }
    } catch (error) {
      if (outgoingRoomCallSoundRoomCallId === roomCallId) {
        stopOutgoingRoomCallSound()
      }

      void error
    }
  }

  const finishOutgoingRoomCallSound = (kind: AppSoundKind) => {
    if (!outgoingRoomCallSoundRoomCallId) return

    stopOutgoingRoomCallSound()
    void playRoomCallSound(kind)
  }

  const clearActiveRoomCallSessionState = () => {
    activeRoomCallId.value = ''
    resetRoomCallPeers()
    resetRoomCallQuickCommands()
    stopOutgoingRoomCallSound()
    stopRoomCallLocalMedia()
  }

  const showRoomCallSessionError = (content: string) => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content
    })
  }

  const resolveRoomCallAckFailureMessage = (response: SocketAckFailure<RoomCallAckFailureReason>) => {
    if (response.message?.silent) return ''
    if (response.message?.text) return response.message.text
    if (response.handledByGlobalError) return ''

    return t(API_I18N.operationFailed)
  }

  const showRoomCallAckFailure = (response: SocketAckFailure<RoomCallAckFailureReason>) => {
    if (response.handledByGlobalError && !response.reason) {
      return
    }

    const message = resolveRoomCallAckFailureMessage(response)

    if (message) {
      showRoomCallSessionError(message)
    }
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
  const { disposeRoomCallQuickCommandMonitor, initializeRoomCallQuickCommandMonitor } = useRoomCallQuickCommandMonitor(
    syncRoomCallQuickCommandReceived,
    syncRoomCallHandRaisedUpdated
  )

  const startActiveRoomCall = async (roomId: string, mediaKind: RoomCallMediaKind) => {
    if (!canStartActiveRoomCall(roomId)) {
      return null
    }

    isStartingRoomCall.value = true

    try {
      await startRoomCallLocalMedia(mediaKind)

      const response = await startRoomCall(roomId, mediaKind)

      if (!response.ok) {
        stopRoomCallLocalMedia()
        showRoomCallAckFailure(response)
        return null
      }

      const { roomCallId } = response.payload

      activeRoomCallId.value = roomCallId
      await syncActiveRoomCallLocalState()
      void startOutgoingRoomCallSound(roomCallId)

      return roomCallId
    } catch (error) {
      log('error', 'Start room call failed', error)
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
        showRoomCallAckFailure(response)
        return null
      }

      const { participantQuickCommandStateByUserId, roomCall } = response.payload
      const localMediaKind = resolveRoomCallJoinMediaKind(roomCall, mediaKind)

      activeRoomCallId.value = roomCall.id

      await startRoomCallLocalMedia(localMediaKind)

      syncInitialRoomCallParticipantQuickCommandStates(participantQuickCommandStateByUserId)
      await syncActiveRoomCallLocalState()
      await connectActiveRoomCallPeers(roomCall)
      void playRoomCallSound('call-connection')

      return roomCall
    } catch (error) {
      log('error', 'Join room call failed', error)
      await leaveRoomCall(roomCallId, 'left')
      clearActiveRoomCallSessionState()
      showRoomCallSessionError(t(ROOM_CALL_SESSION_I18N.roomCallJoinFailed))
      return null
    } finally {
      isJoiningRoomCall.value = false
    }
  }

  const leaveActiveRoomCall = async (reason: RoomCallLeaveReason = 'left') => {
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
    } catch (error) {
      log('error', 'Start room call audio failed', error)
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
    } catch (error) {
      log('error', 'Start room call video failed', error)
      showRoomCallSessionError(t(ROOM_CALL_SESSION_I18N.roomCallVideoStartFailed))
    }
  }

  const startActiveRoomCallScreen = async () => {
    if (isActiveRoomCallScreenSharingByAnotherParticipant.value) {
      return
    }

    try {
      await startScreen()
    } catch (error) {
      log('error', 'Start room call screen failed', error)
      showRoomCallSessionError(t(ROOM_CALL_SESSION_I18N.roomCallScreenStartFailed))
    }
  }

  const stopActiveRoomCallScreen = () => {
    stopScreen()
  }

  const sendActiveRoomCallQuickCommand = async (quickCommand: RoomCallTemporaryQuickCommand) => {
    if (!activeRoomCallId.value) {
      return false
    }

    return sendRoomCallQuickCommand(activeRoomCallId.value, quickCommand)
  }

  const setActiveRoomCallHandRaised = async (handRaised: boolean) => {
    if (!activeRoomCallId.value) {
      return false
    }

    return setRoomCallHandRaised(activeRoomCallId.value, handRaised)
  }

  watch(localMediaState, () => {
    void syncActiveRoomCallLocalState()
  })

  watch(activeRoomCallPeerParticipantKey, () => {
    void connectActiveRoomCallPeers()
  })

  watch(activeRoomCallStatus, (status) => {
    const roomCall = activeRoomCall.value

    if (!roomCall) return

    const isConnected = status === 'in-progress'
    const isInitiatedByCurrentUser = roomCall.initiatorId === user.value.id
    const isOutgoingSoundRoomCall = roomCall.id === outgoingRoomCallSoundRoomCallId
    const shouldFinishOutgoingRoomCallSound = isConnected && isInitiatedByCurrentUser && isOutgoingSoundRoomCall

    if (shouldFinishOutgoingRoomCallSound) {
      finishOutgoingRoomCallSound('call-connection')
    }
  })

  watch(activeRoomCallFinished, (isFinished) => {
    if (isFinished) {
      const shouldPlayInterlocutorBusySound = Boolean(outgoingRoomCallSoundRoomCallId)

      stopOutgoingRoomCallSound()

      if (shouldPlayInterlocutorBusySound) {
        void playRoomCallSound('interlocutor-busy')
      }

      clearActiveRoomCallSessionState()
    }
  })

  watch(isActiveRoomCallScreenSharingByAnotherParticipant, (isScreenSharing) => {
    if (!isScreenSharing) {
      return
    }

    if (!localMediaState.value.screen) {
      return
    }

    stopScreen()
  })

  onMounted(() => {
    initializeRoomCallSignalMonitor()
    initializeRoomCallQuickCommandMonitor()
  })

  onBeforeUnmount(() => {
    disposeRoomCallQuickCommandMonitor()
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
    connectionQualityByUserId,
    handRaisedByUserId,
    temporaryQuickCommandByUserId,
    localMediaState,
    isStartingRoomCall,
    isJoiningRoomCall,
    isLeavingRoomCall,
    isRoomCallSessionBusy,
    resolveActiveRoomCallByRoomId,
    canStartActiveRoomCall,
    startActiveRoomCall,
    joinActiveRoomCall,
    leaveActiveRoomCall,
    setActiveRoomCallAudioEnabled,
    setActiveRoomCallVideoEnabled,
    startActiveRoomCallScreen,
    stopActiveRoomCallScreen,
    sendActiveRoomCallQuickCommand,
    setActiveRoomCallHandRaised
  }
})
