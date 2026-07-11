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

import { useChatRoom } from 'src/entities/chat-room'
import { useRoomCall } from 'src/entities/room-call'
import { useAppSound, useSettings } from 'src/entities/setting'
import { useSystem } from 'src/entities/system'
import { useUser } from 'src/entities/user'
import { API_I18N, setClientUpdateReloadBlock } from 'src/shared/api'
import { type AppSoundKind, log, TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { ROOM_CALL_SESSION_I18N } from '../config/i18n'
import { resolveWorstRoomCallConnectionQuality } from '../lib/resolve-room-call-connection-quality'
import { resolveRoomCallJoinMediaKind } from '../lib/resolve-room-call-join-media-kind'
import { resolveNextRoomCallVideoFacingMode, resolveRoomCallVideoInputDeviceId } from '../lib/room-call-media'
import { isRoomCallBlockingStartForUser, isRoomCallUnfinished } from '../lib/room-call-start-availability'

import { createRoomCallSignalQueue } from './room-call-signal-queue.model'
import { useRoomCallLocalMedia } from './use-room-call-local-media.model'
import { useRoomCallPeerManager } from './use-room-call-peer-manager.model'
import { useRoomCallQuickCommandMonitor } from './use-room-call-quick-command-monitor.model'
import { useRoomCallQuickCommandSync } from './use-room-call-quick-command-sync.model'
import { useRoomCallRuntimeState } from './use-room-call-runtime-state.model'
import { useRoomCallSession } from './use-room-call-session.model'
import { useRoomCallSignalMonitor } from './use-room-call-signal-monitor.model'

export const useActiveRoomCallSession = createGlobalState(() => {
  const activeRoomCallId = ref('')
  const isStartingRoomCall = ref(false)
  const isJoiningRoomCall = ref(false)
  const isLeavingRoomCall = ref(false)
  const { t } = useI18n()
  const toast = useAppToast()
  const { isPrivate: isChatRoomPrivate } = useChatRoom()
  const { put: putRoomCall, roomCalls } = useRoomCall()
  const { settings, setByPath } = useSettings()
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
    videoFacingMode,
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
    setRoomCallPeerRtcConfiguration,
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
  const { resetRoomCallRuntimeState, syncRoomCallRuntimeState } = useRoomCallRuntimeState()
  const {
    clearRoomCallSignalQueue,
    flushRoomCallSignals,
    queueJoiningRoomCallSignal,
    startJoiningRoomCall,
    stopJoiningRoomCall
  } = createRoomCallSignalQueue()
  const localStreams = computed(() => [audioStream.value, videoStream.value, screenStream.value])
  const activeRoomCall = computed(() => roomCalls.value.find(({ id }) => id === activeRoomCallId.value))
  const isActiveRoomCallPrivate = computed(() => {
    const roomCall = activeRoomCall.value

    return Boolean(roomCall && isChatRoomPrivate(roomCall.roomId))
  })
  const localConnectionQuality = computed(() =>
    resolveWorstRoomCallConnectionQuality(Object.values(peerConnectionQualityByUserId.value))
  )
  const connectionQualityByUserId = computed(() => {
    if (isActiveRoomCallPrivate.value) {
      return peerConnectionQualityByUserId.value
    }

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
  const isClientUpdateReloadBlocked = computed(() => Boolean(activeRoomCallId.value) || isRoomCallSessionBusy.value)
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

  const clearActiveRoomCallSessionState = () => {
    activeRoomCallId.value = ''
    clearRoomCallSignalQueue()
    resetRoomCallPeers()
    resetRoomCallQuickCommands()
    resetRoomCallRuntimeState()
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

    const synced = await updateRoomCallMediaState(activeRoomCallId.value, localMediaState.value)

    return synced
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

  const flushPendingRoomCallSignals = async (roomCallId: string) => {
    const signals = flushRoomCallSignals(roomCallId)

    for (const signal of signals) {
      await handleRoomCallSignalReceived(signal, roomCallId, localStreams.value)
    }
  }

  const handleActiveRoomCallSignalReceived = async (payload: EventRoomCallSignalReceived) => {
    const roomCallId = activeRoomCallId.value

    if (payload.roomCallId !== roomCallId) {
      queueJoiningRoomCallSignal(payload)
      return
    }

    await handleRoomCallSignalReceived(payload, roomCallId, localStreams.value)
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

      const { roomCall, roomCallId, rtcConfiguration } = response.payload

      setRoomCallPeerRtcConfiguration(rtcConfiguration)
      await putRoomCall(roomCall)
      activeRoomCallId.value = roomCallId
      syncRoomCallRuntimeState(roomCallId)
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
    startJoiningRoomCall(roomCallId)

    try {
      const response = await joinRoomCall(roomCallId)

      if (!response.ok) {
        showRoomCallAckFailure(response)
        return null
      }

      const { participantQuickCommandStateByUserId, roomCall, rtcConfiguration } = response.payload
      const localMediaKind = resolveRoomCallJoinMediaKind(roomCall, mediaKind)

      setRoomCallPeerRtcConfiguration(rtcConfiguration)
      await putRoomCall(roomCall)
      await startRoomCallLocalMedia(localMediaKind)

      activeRoomCallId.value = roomCall.id
      syncRoomCallRuntimeState(roomCall.id)
      syncInitialRoomCallParticipantQuickCommandStates(participantQuickCommandStateByUserId)
      await syncActiveRoomCallLocalState()
      await flushPendingRoomCallSignals(roomCall.id)
      await connectActiveRoomCallPeers(roomCall)

      return roomCall
    } catch (error) {
      log('error', 'Join room call failed', error)
      await leaveRoomCall(roomCallId, 'left')
      clearActiveRoomCallSessionState()
      showRoomCallSessionError(t(ROOM_CALL_SESSION_I18N.roomCallJoinFailed))
      return null
    } finally {
      stopJoiningRoomCall(roomCallId)
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
      const left = await leaveRoomCall(roomCallId, reason)
      return left
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

  const setActiveRoomCallAudioInputDevice = async (deviceId: string) => {
    const wasAudioEnabled = localMediaState.value.audio
    const shouldRestartAudio = Boolean(audioStream.value)

    await setByPath('ioDevices.audioInputDeviceId', deviceId)

    if (!shouldRestartAudio) {
      return
    }

    try {
      await startAudio({ deviceId, enabled: wasAudioEnabled })
      await syncActiveRoomCallPeerTracks()
    } catch (error) {
      log('error', 'Change room call audio input device failed', error)
      showRoomCallSessionError(t(ROOM_CALL_SESSION_I18N.roomCallAudioStartFailed))
    }
  }

  const setActiveRoomCallVideoInputDevice = async (deviceId: string) => {
    const wasVideoEnabled = localMediaState.value.video
    const shouldRestartVideo = Boolean(videoStream.value)

    await setByPath('ioDevices.videoInputDeviceId', deviceId)

    if (!shouldRestartVideo) {
      return
    }

    try {
      await startVideo({ deviceId, enabled: wasVideoEnabled })
      await syncActiveRoomCallPeerTracks()
    } catch (error) {
      log('error', 'Change room call video input device failed', error)
      showRoomCallSessionError(t(ROOM_CALL_SESSION_I18N.roomCallVideoStartFailed))
    }
  }

  const setActiveRoomCallAudioOutputDevice = (deviceId: string) => {
    return setByPath('ioDevices.audioOutputDeviceId', deviceId)
  }

  const switchActiveRoomCallVideoFacingMode = async () => {
    if (!localMediaState.value.video) {
      return
    }

    const nextFacingMode = resolveNextRoomCallVideoFacingMode(videoFacingMode.value)

    try {
      await setByPath('ioDevices.videoInputDeviceId', '')
      const stream = await startVideo({ deviceId: '', facingMode: nextFacingMode })
      await syncActiveRoomCallPeerTracks()
      const deviceId = resolveRoomCallVideoInputDeviceId(stream)

      if (deviceId) {
        await setByPath('ioDevices.videoInputDeviceId', deviceId)
      }
    } catch (error) {
      log('error', 'Switch room call video input facing mode failed', error)
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
      stopOutgoingRoomCallSound()
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
  watch(
    isClientUpdateReloadBlocked,
    (isBlocked) => {
      setClientUpdateReloadBlock('room-call-session', isBlocked)
    },
    { immediate: true }
  )

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
    videoFacingMode,
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
    setActiveRoomCallAudioInputDevice,
    setActiveRoomCallVideoInputDevice,
    setActiveRoomCallAudioOutputDevice,
    switchActiveRoomCallVideoFacingMode,
    startActiveRoomCallScreen,
    stopActiveRoomCallScreen,
    sendActiveRoomCallQuickCommand,
    setActiveRoomCallHandRaised
  }
})
