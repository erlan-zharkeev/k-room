import { useIntervalFn, useTimeoutFn } from '@vueuse/core'
import { type EventRoomCallSignalReceived, type RoomCallRtcConfiguration, type RoomCallSignalKind } from 'global-shared'
import { v4 as uuidv4 } from 'uuid'
import { shallowRef } from 'vue'

import {
  ROOM_CALL_CONNECTION_QUALITY_CHECK_INTERVAL_MS,
  ROOM_CALL_PEER_CONNECTION_TIMEOUT_MS,
  ROOM_CALL_PEER_DISCONNECTED_TIMEOUT_MS,
  ROOM_CALL_PEER_OPERATION_TIMEOUT_MS,
  ROOM_CALL_RTC_CONFIGURATION
} from '../config/constants'
import type {
  ConnectRoomCallPeersParams,
  RoomCallConnectionQuality,
  RoomCallConnectionQualityByUserId,
  RoomCallLocalMediaStreamList,
  RoomCallRemoteStreamsByUserId
} from '../config/types'
import { resolveRoomCallConnectionQuality } from '../lib/resolve-room-call-connection-quality'
import {
  appendRoomCallRemoteTrack,
  isClosedRoomCallPeerConnection,
  removeRoomCallRemoteTrack,
  resolveRoomCallPeerParticipantIds,
  shouldCreateRoomCallPeerOffer,
  syncRoomCallPeerLocalTracks
} from '../lib/room-call-peer'
import {
  isExpectedRoomCallPeerSignalError,
  isRecoverableRoomCallPeerDescriptionError
} from '../lib/room-call-peer-error'
import { isRoomCallIceCandidateSignal, isRoomCallSessionDescriptionSignal } from '../lib/room-call-peer-signal'
import {
  buildRoomCallErrorDiagnostics,
  buildRoomCallLocalStreamsDiagnostics,
  buildRoomCallLocalTrackIdDiagnostics,
  buildRoomCallMediaStreamDiagnostics,
  buildRoomCallMediaTrackDiagnostics,
  buildRoomCallPeerConnectionDiagnostics,
  buildRoomCallSelectedCandidatePairDiagnostics,
  buildRoomCallSignalDiagnostics,
  captureRoomCallDiagnostic
} from '../lib/room-call-sentry-diagnostics'

import { useRoomCallSession } from './use-room-call-session.model'

const createRoomCallPeerTimeoutError = () => new DOMException('Room call peer operation timed out', 'TimeoutError')

const isRoomCallPeerTimeoutError = (error: unknown) => {
  return error instanceof DOMException && error.name === 'TimeoutError'
}

const withRoomCallPeerTimeout = async <T>(task: Promise<T>, timeoutMs: number, onTimeout: () => void) => {
  let stopTimeout: (() => void) | undefined
  const timeoutTask = new Promise<never>((_, reject) => {
    const { stop } = useTimeoutFn(
      () => {
        onTimeout()
        reject(createRoomCallPeerTimeoutError())
      },
      timeoutMs,
      { immediate: true }
    )

    stopTimeout = stop
  })

  try {
    return await Promise.race([task, timeoutTask])
  } finally {
    stopTimeout?.()
  }
}

export const useRoomCallPeerManager = () => {
  const peerConnectionByUserId = new Map<string, RTCPeerConnection>()
  const iceCandidatesByUserId = new Map<string, RTCIceCandidateInit[]>()
  const appliedIceCandidateCountByUserId = new Map<string, number>()
  const generatedIceCandidateCountByUserId = new Map<string, number>()
  const queuedIceCandidateCountByUserId = new Map<string, number>()
  const receivedIceCandidateCountByUserId = new Map<string, number>()
  const peerTaskByUserId = new Map<string, Promise<void>>()
  const peerConnectionWatchdogStopByUserId = new Map<string, () => void>()
  const makingOfferByUserId = new Set<string>()
  const recoveringPeerUserIds = new Set<string>()
  const remoteStreamsByUserId = shallowRef<RoomCallRemoteStreamsByUserId>({})
  const connectionQualityByUserId = shallowRef<RoomCallConnectionQualityByUserId>({})
  let localUserId: string | null = null
  let roomCallRtcConfiguration: RTCConfiguration = ROOM_CALL_RTC_CONFIGURATION
  const { sendRoomCallSignal } = useRoomCallSession()
  const { pause: pauseConnectionQualityMonitor, resume: resumeConnectionQualityMonitor } = useIntervalFn(
    () => {
      void syncRoomCallConnectionQualities()
    },
    ROOM_CALL_CONNECTION_QUALITY_CHECK_INTERVAL_MS,
    { immediate: false, immediateCallback: false }
  )

  const incrementPeerCounter = (counter: Map<string, number>, userId: string) => {
    const count = (counter.get(userId) ?? 0) + 1

    counter.set(userId, count)

    return count
  }

  const buildRoomCallPeerCountersDiagnostics = (userId: string) => ({
    appliedIceCandidateCount: appliedIceCandidateCountByUserId.get(userId) ?? 0,
    generatedIceCandidateCount: generatedIceCandidateCountByUserId.get(userId) ?? 0,
    queuedIceCandidateCount: queuedIceCandidateCountByUserId.get(userId) ?? 0,
    receivedIceCandidateCount: receivedIceCandidateCountByUserId.get(userId) ?? 0
  })

  const captureRoomCallPeerDiagnostic = (
    event: string,
    context: Record<string, unknown> = {},
    level: 'error' | 'info' | 'warning' = 'info'
  ) => {
    captureRoomCallDiagnostic(
      event,
      {
        localUserId,
        ...context
      },
      level
    )
  }

  const runRoomCallPeerOperation = async <T>(operation: string, task: Promise<T>, context: Record<string, unknown>) => {
    return withRoomCallPeerTimeout(task, ROOM_CALL_PEER_OPERATION_TIMEOUT_MS, () => {
      captureRoomCallPeerDiagnostic(
        'peer-operation-timeout',
        {
          ...context,
          operation,
          timeoutMs: ROOM_CALL_PEER_OPERATION_TIMEOUT_MS
        },
        'warning'
      )
    })
  }

  const setRoomCallPeerRtcConfiguration = (configuration: RoomCallRtcConfiguration) => {
    roomCallRtcConfiguration = configuration
    captureRoomCallPeerDiagnostic('peer-rtc-configuration-set', {
      iceServerCount: configuration.iceServers.length,
      hasTurnServer: configuration.iceServers.some(({ urls }) => urls.some((url) => url.startsWith('turn')))
    })
  }

  const updateRemoteStream = (userId: string, stream: MediaStream) => {
    remoteStreamsByUserId.value = {
      ...remoteStreamsByUserId.value,
      [userId]: stream
    }
  }

  const removeRemoteStream = (userId: string) => {
    const { [userId]: _remoteStream, ...remoteStreams } = remoteStreamsByUserId.value

    remoteStreamsByUserId.value = remoteStreams
  }

  const isCurrentRoomCallPeerConnection = (userId: string, peerConnection: RTCPeerConnection) => {
    return peerConnectionByUserId.get(userId) === peerConnection && !isClosedRoomCallPeerConnection(peerConnection)
  }

  const syncRemoteStreamAfterTrackRemoval = (userId: string, stream: MediaStream) => {
    if (stream.getTracks().length) {
      updateRemoteStream(userId, stream)
      return
    }

    removeRemoteStream(userId)
  }

  const updateRoomCallConnectionQuality = (userId: string, quality: RoomCallConnectionQuality) => {
    if (connectionQualityByUserId.value[userId] === quality) {
      return
    }

    connectionQualityByUserId.value = {
      ...connectionQualityByUserId.value,
      [userId]: quality
    }
  }

  const removeRoomCallConnectionQuality = (userId: string) => {
    const { [userId]: _connectionQuality, ...connectionQuality } = connectionQualityByUserId.value

    connectionQualityByUserId.value = connectionQuality
  }

  const syncRoomCallConnectionQualityMonitor = () => {
    if (peerConnectionByUserId.size > 0) {
      resumeConnectionQualityMonitor()
      return
    }

    pauseConnectionQualityMonitor()
  }

  const syncRoomCallConnectionQuality = async (userId: string, peerConnection: RTCPeerConnection) => {
    try {
      const statsReport = await peerConnection.getStats()
      const quality = resolveRoomCallConnectionQuality(peerConnection.connectionState, statsReport)

      updateRoomCallConnectionQuality(userId, quality)
    } catch (error) {
      captureRoomCallPeerDiagnostic(
        'peer-connection-quality-sync-failed',
        {
          error: buildRoomCallErrorDiagnostics(error),
          peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
          peerUserId: userId
        },
        'warning'
      )
    }
  }

  const syncRoomCallConnectionQualities = async () => {
    await Promise.all(
      Array.from(peerConnectionByUserId.entries()).map(([userId, peerConnection]) =>
        syncRoomCallConnectionQuality(userId, peerConnection)
      )
    )
  }

  const captureRoomCallSelectedCandidatePair = async (
    roomCallId: string,
    userId: string,
    peerConnection: RTCPeerConnection
  ) => {
    try {
      const statsReport = await peerConnection.getStats()

      captureRoomCallPeerDiagnostic('peer-selected-candidate-pair', {
        candidatePair: buildRoomCallSelectedCandidatePairDiagnostics(statsReport),
        peerUserId: userId,
        roomCallId
      })
    } catch (error) {
      captureRoomCallPeerDiagnostic(
        'peer-selected-candidate-pair-read-failed',
        {
          error: buildRoomCallErrorDiagnostics(error),
          peerUserId: userId,
          roomCallId
        },
        'warning'
      )
    }
  }

  const sendPeerSignal = async (
    roomCallId: string,
    toUserId: string,
    signalKind: RoomCallSignalKind,
    signal: unknown
  ) => {
    const signalId = uuidv4()
    captureRoomCallPeerDiagnostic('peer-signal-send-started', {
      roomCallId,
      signal: buildRoomCallSignalDiagnostics(signal),
      signalId,
      signalKind,
      toUserId
    })
    const delivered = await sendRoomCallSignal({
      roomCallId,
      signal,
      signalId,
      signalKind,
      toUserId
    })

    captureRoomCallPeerDiagnostic(delivered ? 'peer-signal-delivered' : 'peer-signal-delivery-failed', {
      roomCallId,
      signalId,
      signalKind,
      toUserId
    })

    return delivered
  }

  const handleRoomCallPeerSignalError = (error: unknown, context: Record<string, unknown> = {}) => {
    if (isExpectedRoomCallPeerSignalError(error)) {
      captureRoomCallPeerDiagnostic(
        'peer-signal-expected-error',
        {
          error: buildRoomCallErrorDiagnostics(error),
          ...context
        },
        'warning'
      )
      return
    }

    captureRoomCallPeerDiagnostic(
      'peer-signal-unexpected-error',
      {
        error: buildRoomCallErrorDiagnostics(error),
        ...context
      },
      'error'
    )
    throw error
  }

  const hasRoomCallPeerSignalingState = (peerConnection: RTCPeerConnection, signalingState: RTCSignalingState) => {
    return peerConnection.signalingState === signalingState
  }

  const enqueueRoomCallPeerTask = async (userId: string, task: () => Promise<void>) => {
    const previousTask = peerTaskByUserId.get(userId) ?? Promise.resolve()
    const nextTask = previousTask
      .catch(() => undefined)
      .then(task)
      .catch((error) => {
        handleRoomCallPeerSignalError(error, {
          counters: buildRoomCallPeerCountersDiagnostics(userId),
          peer: peerConnectionByUserId.get(userId)
            ? buildRoomCallPeerConnectionDiagnostics(peerConnectionByUserId.get(userId) as RTCPeerConnection)
            : undefined,
          peerUserId: userId
        })
      })

    peerTaskByUserId.set(userId, nextTask)

    try {
      await nextTask
    } finally {
      if (peerTaskByUserId.get(userId) === nextTask) {
        peerTaskByUserId.delete(userId)
      }
    }
  }

  const isPoliteRoomCallPeer = (fromUserId: string) => {
    return !localUserId || localUserId > fromUserId
  }

  const shouldIgnoreRoomCallPeerOfferCollision = (fromUserId: string, peerConnection: RTCPeerConnection) => {
    const hasOfferCollision = makingOfferByUserId.has(fromUserId) || peerConnection.signalingState !== 'stable'

    const shouldIgnore = hasOfferCollision && !isPoliteRoomCallPeer(fromUserId)

    if (shouldIgnore) {
      captureRoomCallPeerDiagnostic('peer-offer-collision-ignored', {
        hasOfferCollision,
        makingOffer: makingOfferByUserId.has(fromUserId),
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        peerUserId: fromUserId
      })
    }

    return shouldIgnore
  }

  const rollbackRoomCallPeerLocalOffer = async (userId: string, peerConnection: RTCPeerConnection) => {
    if (peerConnection.signalingState !== 'have-local-offer') {
      return true
    }

    try {
      await runRoomCallPeerOperation('set-local-rollback', peerConnection.setLocalDescription({ type: 'rollback' }), {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        peerUserId: userId
      })
      captureRoomCallPeerDiagnostic('peer-local-offer-rolled-back', {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        peerUserId: userId
      })
      return true
    } catch (error) {
      handleRoomCallPeerSignalError(error, {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        peerUserId: userId
      })
      return false
    }
  }

  const addRoomCallPeerIceCandidateToConnection = async (
    userId: string,
    peerConnection: RTCPeerConnection,
    candidate: RTCIceCandidateInit
  ) => {
    try {
      await runRoomCallPeerOperation('add-ice-candidate', peerConnection.addIceCandidate(candidate), {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        peerUserId: userId,
        signal: buildRoomCallSignalDiagnostics(candidate)
      })
      incrementPeerCounter(appliedIceCandidateCountByUserId, userId)
    } catch (error) {
      handleRoomCallPeerSignalError(error, {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        peerUserId: userId,
        signal: buildRoomCallSignalDiagnostics(candidate)
      })
    }
  }

  const closeRoomCallPeer = (userId: string, shouldClearPeerTask = true) => {
    const peerConnection = peerConnectionByUserId.get(userId)
    const stopConnectionWatchdog = peerConnectionWatchdogStopByUserId.get(userId)

    stopConnectionWatchdog?.()
    peerConnectionWatchdogStopByUserId.delete(userId)

    if (peerConnection) {
      peerConnection.close()
      peerConnectionByUserId.delete(userId)
    }

    iceCandidatesByUserId.delete(userId)
    makingOfferByUserId.delete(userId)
    if (shouldClearPeerTask) {
      peerTaskByUserId.delete(userId)
    }
    appliedIceCandidateCountByUserId.delete(userId)
    generatedIceCandidateCountByUserId.delete(userId)
    queuedIceCandidateCountByUserId.delete(userId)
    receivedIceCandidateCountByUserId.delete(userId)
    removeRemoteStream(userId)
    removeRoomCallConnectionQuality(userId)
    syncRoomCallConnectionQualityMonitor()
  }

  const pushRoomCallPeerIceCandidate = (userId: string, candidate: RTCIceCandidateInit) => {
    const candidates = iceCandidatesByUserId.get(userId) ?? []

    iceCandidatesByUserId.set(userId, [...candidates, candidate])
    incrementPeerCounter(queuedIceCandidateCountByUserId, userId)
  }

  const flushRoomCallPeerIceCandidates = async (userId: string, peerConnection: RTCPeerConnection) => {
    const candidates = iceCandidatesByUserId.get(userId) ?? []

    iceCandidatesByUserId.delete(userId)
    await Promise.all(
      candidates.map((candidate) => addRoomCallPeerIceCandidateToConnection(userId, peerConnection, candidate))
    )
  }

  const syncRoomCallPeerParticipants = (
    currentUserId: string,
    participants: ConnectRoomCallPeersParams['participants']
  ) => {
    const targetUserIds = resolveRoomCallPeerParticipantIds(currentUserId, participants)
    const targetUserIdSet = new Set(targetUserIds)

    Array.from(peerConnectionByUserId.keys()).forEach((userId) => {
      if (!targetUserIdSet.has(userId)) {
        closeRoomCallPeer(userId)
      }
    })

    return targetUserIds
  }

  const scheduleRoomCallPeerConnectionWatchdog = (
    roomCallId: string,
    userId: string,
    peerConnection: RTCPeerConnection,
    localStreams: RoomCallLocalMediaStreamList,
    timeoutMs: number
  ) => {
    peerConnectionWatchdogStopByUserId.get(userId)?.()
    const { stop } = useTimeoutFn(
      () => {
        if (
          !isCurrentRoomCallPeerConnection(userId, peerConnection) ||
          peerConnection.connectionState === 'connected'
        ) {
          return
        }

        captureRoomCallPeerDiagnostic(
          'peer-connection-watchdog-timeout',
          {
            peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
            peerUserId: userId,
            roomCallId,
            timeoutMs
          },
          'warning'
        )
        void enqueueRoomCallPeerTask(userId, async () => {
          if (isCurrentRoomCallPeerConnection(userId, peerConnection)) {
            await recoverRoomCallPeerConnection(roomCallId, userId, localStreams)
          }
        })
      },
      timeoutMs,
      { immediate: true }
    )

    peerConnectionWatchdogStopByUserId.set(userId, stop)
  }

  const ensureRoomCallPeerConnection = async (
    roomCallId: string,
    userId: string,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    const currentPeerConnection = peerConnectionByUserId.get(userId)

    if (currentPeerConnection) {
      await syncRoomCallPeerLocalTracks(currentPeerConnection, localStreams)

      return currentPeerConnection
    }

    const peerConnection = new RTCPeerConnection(roomCallRtcConfiguration)

    await syncRoomCallPeerLocalTracks(peerConnection, localStreams)
    peerConnection.addEventListener('icecandidate', ({ candidate }) => {
      if (candidate) {
        incrementPeerCounter(generatedIceCandidateCountByUserId, userId)
        void sendPeerSignal(roomCallId, userId, 'ice-candidate', candidate.toJSON())
        return
      }
    })
    peerConnection.addEventListener('icecandidateerror', (event) => {
      captureRoomCallPeerDiagnostic(
        'peer-ice-candidate-error',
        {
          errorCode: event.errorCode,
          errorText: event.errorText,
          peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
          peerUserId: userId,
          roomCallId,
          url: event.url
        },
        'warning'
      )
    })
    peerConnection.addEventListener('track', ({ track }) => {
      if (!isCurrentRoomCallPeerConnection(userId, peerConnection)) {
        captureRoomCallPeerDiagnostic('peer-remote-track-ignored-after-close', {
          peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
          peerUserId: userId,
          roomCallId,
          track: buildRoomCallMediaTrackDiagnostics(track)
        })
        return
      }

      const remoteStream = remoteStreamsByUserId.value[userId] ?? new MediaStream()

      appendRoomCallRemoteTrack(remoteStream, track)
      updateRemoteStream(userId, remoteStream)
      captureRoomCallPeerDiagnostic('peer-remote-track-received', {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        peerUserId: userId,
        remoteStream: buildRoomCallMediaStreamDiagnostics(remoteStream),
        roomCallId,
        track: buildRoomCallMediaTrackDiagnostics(track)
      })
      track.addEventListener('mute', () => {
        if (!isCurrentRoomCallPeerConnection(userId, peerConnection)) return

        captureRoomCallPeerDiagnostic('peer-remote-track-muted', {
          peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
          peerUserId: userId,
          remoteStream: buildRoomCallMediaStreamDiagnostics(remoteStream),
          roomCallId,
          track: buildRoomCallMediaTrackDiagnostics(track)
        })
      })
      track.addEventListener('unmute', () => {
        if (!isCurrentRoomCallPeerConnection(userId, peerConnection)) return

        captureRoomCallPeerDiagnostic('peer-remote-track-unmuted', {
          peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
          peerUserId: userId,
          remoteStream: buildRoomCallMediaStreamDiagnostics(remoteStream),
          roomCallId,
          track: buildRoomCallMediaTrackDiagnostics(track)
        })
      })
      track.addEventListener(
        'ended',
        () => {
          if (!isCurrentRoomCallPeerConnection(userId, peerConnection)) return

          removeRoomCallRemoteTrack(remoteStream, track)
          syncRemoteStreamAfterTrackRemoval(userId, remoteStream)
          captureRoomCallPeerDiagnostic('peer-remote-track-ended', {
            peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
            peerUserId: userId,
            remoteStream: buildRoomCallMediaStreamDiagnostics(remoteStream),
            roomCallId,
            track: buildRoomCallMediaTrackDiagnostics(track)
          })
        },
        { once: true }
      )
    })
    peerConnection.addEventListener('connectionstatechange', () => {
      if (!isCurrentRoomCallPeerConnection(userId, peerConnection)) {
        return
      }

      captureRoomCallPeerDiagnostic('peer-connection-state-changed', {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        peerUserId: userId,
        roomCallId
      })
      void syncRoomCallConnectionQuality(userId, peerConnection)

      if (peerConnection.connectionState === 'connected') {
        peerConnectionWatchdogStopByUserId.get(userId)?.()
        peerConnectionWatchdogStopByUserId.delete(userId)
        void captureRoomCallSelectedCandidatePair(roomCallId, userId, peerConnection)
        return
      }

      if (isClosedRoomCallPeerConnection(peerConnection)) {
        closeRoomCallPeer(userId)
        return
      }

      const timeoutMs =
        peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'failed'
          ? ROOM_CALL_PEER_DISCONNECTED_TIMEOUT_MS
          : ROOM_CALL_PEER_CONNECTION_TIMEOUT_MS

      scheduleRoomCallPeerConnectionWatchdog(roomCallId, userId, peerConnection, localStreams, timeoutMs)
    })
    peerConnectionByUserId.set(userId, peerConnection)
    scheduleRoomCallPeerConnectionWatchdog(
      roomCallId,
      userId,
      peerConnection,
      localStreams,
      ROOM_CALL_PEER_CONNECTION_TIMEOUT_MS
    )
    syncRoomCallConnectionQualityMonitor()
    void syncRoomCallConnectionQuality(userId, peerConnection)

    return peerConnection
  }

  const createAndSendRoomCallPeerOffer = async (
    roomCallId: string,
    toUserId: string,
    peerConnection: RTCPeerConnection
  ) => {
    if (peerConnection.signalingState !== 'stable') {
      captureRoomCallPeerDiagnostic('peer-offer-create-skipped', {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId,
        toUserId
      })
      return
    }

    makingOfferByUserId.add(toUserId)
    captureRoomCallPeerDiagnostic('peer-offer-create-started', {
      peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
      roomCallId,
      toUserId
    })

    try {
      const offer = await runRoomCallPeerOperation('create-offer', peerConnection.createOffer(), {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId,
        toUserId
      })
      captureRoomCallPeerDiagnostic('peer-offer-created', {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId,
        signal: buildRoomCallSignalDiagnostics(offer),
        toUserId
      })

      if (peerConnection.signalingState !== 'stable') {
        captureRoomCallPeerDiagnostic('peer-offer-set-local-skipped', {
          peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
          roomCallId,
          signal: buildRoomCallSignalDiagnostics(offer),
          toUserId
        })
        return
      }

      await runRoomCallPeerOperation('set-local-offer', peerConnection.setLocalDescription(offer), {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId,
        signal: buildRoomCallSignalDiagnostics(offer),
        toUserId
      })
      captureRoomCallPeerDiagnostic('peer-offer-local-description-set', {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId,
        signal: buildRoomCallSignalDiagnostics(offer),
        toUserId
      })

      const localDescription = peerConnection.localDescription

      if (localDescription) {
        const delivered = await sendPeerSignal(roomCallId, toUserId, 'offer', localDescription.toJSON())

        if (!delivered) {
          throw createRoomCallPeerTimeoutError()
        }

        return
      }

      captureRoomCallPeerDiagnostic(
        'peer-offer-local-description-missing',
        {
          peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
          roomCallId,
          toUserId
        },
        'warning'
      )
    } finally {
      makingOfferByUserId.delete(toUserId)
      captureRoomCallPeerDiagnostic('peer-offer-create-finished', {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId,
        toUserId
      })
    }
  }

  const recoverRoomCallPeerConnection = async (
    roomCallId: string,
    userId: string,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    if (recoveringPeerUserIds.has(userId)) {
      return
    }

    recoveringPeerUserIds.add(userId)
    captureRoomCallPeerDiagnostic('peer-connection-recover-started', {
      localStreams: buildRoomCallLocalStreamsDiagnostics(localStreams),
      roomCallId,
      userId
    })
    try {
      closeRoomCallPeer(userId, false)

      const peerConnection = await ensureRoomCallPeerConnection(roomCallId, userId, localStreams)

      await createAndSendRoomCallPeerOffer(roomCallId, userId, peerConnection)
      captureRoomCallPeerDiagnostic('peer-connection-recover-finished', {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId,
        userId
      })
    } finally {
      recoveringPeerUserIds.delete(userId)
    }
  }

  const handleRoomCallPeerDescriptionError = async (
    error: unknown,
    roomCallId: string,
    userId: string,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    if (!isRecoverableRoomCallPeerDescriptionError(error)) {
      handleRoomCallPeerSignalError(error, {
        peerUserId: userId,
        roomCallId
      })
      return
    }

    captureRoomCallPeerDiagnostic('peer-description-error-recoverable', {
      error: buildRoomCallErrorDiagnostics(error),
      peerUserId: userId,
      roomCallId
    })
    await recoverRoomCallPeerConnection(roomCallId, userId, localStreams)
  }

  const createRoomCallPeerOffer = async (
    roomCallId: string,
    toUserId: string,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    const peerConnection = await ensureRoomCallPeerConnection(roomCallId, toUserId, localStreams)

    try {
      captureRoomCallPeerDiagnostic('peer-offer-flow-started', {
        localStreams: buildRoomCallLocalStreamsDiagnostics(localStreams),
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId,
        toUserId
      })
      await createAndSendRoomCallPeerOffer(roomCallId, toUserId, peerConnection)
    } catch (error) {
      if (isRoomCallPeerTimeoutError(error)) {
        await recoverRoomCallPeerConnection(roomCallId, toUserId, localStreams)
        return
      }

      await handleRoomCallPeerDescriptionError(error, roomCallId, toUserId, localStreams)
    }
  }

  const answerRoomCallPeerOffer = async (
    payload: EventRoomCallSignalReceived,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    if (!isRoomCallSessionDescriptionSignal(payload.signal, 'offer')) {
      captureRoomCallPeerDiagnostic(
        'peer-offer-invalid-signal',
        {
          fromUserId: payload.fromUserId,
          roomCallId: payload.roomCallId,
          signal: buildRoomCallSignalDiagnostics(payload.signal),
          signalKind: payload.signalKind
        },
        'warning'
      )
      return
    }

    const peerConnection = await ensureRoomCallPeerConnection(payload.roomCallId, payload.fromUserId, localStreams)
    captureRoomCallPeerDiagnostic('peer-offer-received', {
      fromUserId: payload.fromUserId,
      localStreams: buildRoomCallLocalStreamsDiagnostics(localStreams),
      peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
      roomCallId: payload.roomCallId,
      signal: buildRoomCallSignalDiagnostics(payload.signal)
    })

    if (shouldIgnoreRoomCallPeerOfferCollision(payload.fromUserId, peerConnection)) {
      return
    }

    const didRollbackLocalOffer = await rollbackRoomCallPeerLocalOffer(payload.fromUserId, peerConnection)

    if (!didRollbackLocalOffer || !hasRoomCallPeerSignalingState(peerConnection, 'stable')) {
      captureRoomCallPeerDiagnostic(
        'peer-offer-answer-skipped-after-rollback',
        {
          didRollbackLocalOffer,
          fromUserId: payload.fromUserId,
          peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
          roomCallId: payload.roomCallId
        },
        'warning'
      )
      return
    }

    try {
      captureRoomCallPeerDiagnostic('peer-offer-set-remote-started', {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signal: buildRoomCallSignalDiagnostics(payload.signal),
        signalId: payload.signalId
      })
      await runRoomCallPeerOperation('set-remote-offer', peerConnection.setRemoteDescription(payload.signal), {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signalId: payload.signalId
      })
      captureRoomCallPeerDiagnostic('peer-offer-remote-description-set', {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signal: buildRoomCallSignalDiagnostics(payload.signal),
        signalId: payload.signalId
      })

      if (!hasRoomCallPeerSignalingState(peerConnection, 'have-remote-offer')) {
        captureRoomCallPeerDiagnostic(
          'peer-answer-create-skipped',
          {
            fromUserId: payload.fromUserId,
            peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
            roomCallId: payload.roomCallId
          },
          'warning'
        )
        return
      }

      captureRoomCallPeerDiagnostic('peer-answer-create-started', {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId
      })
      const answer = await runRoomCallPeerOperation('create-answer', peerConnection.createAnswer(), {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signalId: payload.signalId
      })
      captureRoomCallPeerDiagnostic('peer-answer-created', {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signal: buildRoomCallSignalDiagnostics(answer)
      })

      if (!hasRoomCallPeerSignalingState(peerConnection, 'have-remote-offer')) {
        captureRoomCallPeerDiagnostic(
          'peer-answer-set-local-skipped',
          {
            fromUserId: payload.fromUserId,
            peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
            roomCallId: payload.roomCallId,
            signal: buildRoomCallSignalDiagnostics(answer)
          },
          'warning'
        )
        return
      }

      captureRoomCallPeerDiagnostic('peer-answer-set-local-started', {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signal: buildRoomCallSignalDiagnostics(answer)
      })
      await runRoomCallPeerOperation('set-local-answer', peerConnection.setLocalDescription(answer), {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signalId: payload.signalId
      })
      captureRoomCallPeerDiagnostic('peer-answer-local-description-set', {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signal: buildRoomCallSignalDiagnostics(answer)
      })
      await flushRoomCallPeerIceCandidates(payload.fromUserId, peerConnection)

      const localDescription = peerConnection.localDescription

      if (localDescription) {
        const delivered = await sendPeerSignal(
          payload.roomCallId,
          payload.fromUserId,
          'answer',
          localDescription.toJSON()
        )

        if (!delivered) {
          throw createRoomCallPeerTimeoutError()
        }

        return
      }

      captureRoomCallPeerDiagnostic(
        'peer-answer-local-description-missing',
        {
          fromUserId: payload.fromUserId,
          peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
          roomCallId: payload.roomCallId
        },
        'warning'
      )
    } catch (error) {
      if (isRoomCallPeerTimeoutError(error)) {
        await recoverRoomCallPeerConnection(payload.roomCallId, payload.fromUserId, localStreams)
        return
      }

      await handleRoomCallPeerDescriptionError(error, payload.roomCallId, payload.fromUserId, localStreams)
    }
  }

  const acceptRoomCallPeerAnswer = async (
    payload: EventRoomCallSignalReceived,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    const peerConnection = peerConnectionByUserId.get(payload.fromUserId)

    if (!peerConnection || !isRoomCallSessionDescriptionSignal(payload.signal, 'answer')) {
      captureRoomCallPeerDiagnostic(
        'peer-answer-ignored',
        {
          fromUserId: payload.fromUserId,
          hasPeerConnection: Boolean(peerConnection),
          roomCallId: payload.roomCallId,
          signal: buildRoomCallSignalDiagnostics(payload.signal),
          signalKind: payload.signalKind
        },
        'warning'
      )
      return
    }

    if (peerConnection.signalingState !== 'have-local-offer') {
      captureRoomCallPeerDiagnostic(
        'peer-answer-wrong-signaling-state',
        {
          fromUserId: payload.fromUserId,
          peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
          roomCallId: payload.roomCallId,
          signal: buildRoomCallSignalDiagnostics(payload.signal)
        },
        'warning'
      )
      return
    }

    try {
      captureRoomCallPeerDiagnostic('peer-answer-set-remote-started', {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signal: buildRoomCallSignalDiagnostics(payload.signal),
        signalId: payload.signalId
      })
      await runRoomCallPeerOperation('set-remote-answer', peerConnection.setRemoteDescription(payload.signal), {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signalId: payload.signalId
      })
      captureRoomCallPeerDiagnostic('peer-answer-remote-description-set', {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signal: buildRoomCallSignalDiagnostics(payload.signal),
        signalId: payload.signalId
      })
      await flushRoomCallPeerIceCandidates(payload.fromUserId, peerConnection)
    } catch (error) {
      if (isRoomCallPeerTimeoutError(error)) {
        await recoverRoomCallPeerConnection(payload.roomCallId, payload.fromUserId, localStreams)
        return
      }

      await handleRoomCallPeerDescriptionError(error, payload.roomCallId, payload.fromUserId, localStreams)
    }
  }

  const addRoomCallPeerIceCandidate = async (payload: EventRoomCallSignalReceived) => {
    if (!isRoomCallIceCandidateSignal(payload.signal)) {
      captureRoomCallPeerDiagnostic(
        'peer-ice-candidate-invalid-signal',
        {
          fromUserId: payload.fromUserId,
          roomCallId: payload.roomCallId,
          signal: buildRoomCallSignalDiagnostics(payload.signal),
          signalKind: payload.signalKind
        },
        'warning'
      )
      return
    }

    incrementPeerCounter(receivedIceCandidateCountByUserId, payload.fromUserId)
    const peerConnection = peerConnectionByUserId.get(payload.fromUserId)

    if (!peerConnection) {
      pushRoomCallPeerIceCandidate(payload.fromUserId, payload.signal)
      return
    }

    if (!peerConnection.remoteDescription) {
      pushRoomCallPeerIceCandidate(payload.fromUserId, payload.signal)
      return
    }

    await addRoomCallPeerIceCandidateToConnection(payload.fromUserId, peerConnection, payload.signal)
  }

  const handleRoomCallSignalReceived = async (
    payload: EventRoomCallSignalReceived,
    roomCallId: string,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    captureRoomCallPeerDiagnostic('peer-signal-received', {
      activeRoomCallId: roomCallId,
      fromUserId: payload.fromUserId,
      roomCallId: payload.roomCallId,
      signal: buildRoomCallSignalDiagnostics(payload.signal),
      signalId: payload.signalId,
      signalKind: payload.signalKind
    })
    if (payload.roomCallId !== roomCallId) {
      captureRoomCallPeerDiagnostic('peer-signal-ignored-by-room', {
        activeRoomCallId: roomCallId,
        fromUserId: payload.fromUserId,
        payloadRoomCallId: payload.roomCallId,
        signal: buildRoomCallSignalDiagnostics(payload.signal),
        signalKind: payload.signalKind
      })
      return
    }

    await enqueueRoomCallPeerTask(payload.fromUserId, async () => {
      switch (payload.signalKind) {
        case 'offer':
          await answerRoomCallPeerOffer(payload, localStreams)
          break
        case 'answer':
          await acceptRoomCallPeerAnswer(payload, localStreams)
          break
        case 'ice-candidate':
          try {
            await addRoomCallPeerIceCandidate(payload)
          } catch (error) {
            if (!isRoomCallPeerTimeoutError(error)) {
              throw error
            }

            await recoverRoomCallPeerConnection(payload.roomCallId, payload.fromUserId, localStreams)
          }
          break
      }
    })
  }

  const connectRoomCallPeers = async ({
    currentUserId,
    localStreams,
    participants,
    roomCallId
  }: ConnectRoomCallPeersParams) => {
    localUserId = currentUserId

    const targetUserIds = syncRoomCallPeerParticipants(currentUserId, participants)

    await Promise.all(
      targetUserIds.map(async (targetUserId) => {
        await enqueueRoomCallPeerTask(targetUserId, async () => {
          await ensureRoomCallPeerConnection(roomCallId, targetUserId, localStreams)

          if (shouldCreateRoomCallPeerOffer(currentUserId, targetUserId)) {
            await createRoomCallPeerOffer(roomCallId, targetUserId, localStreams)
          }
        })
      })
    )
  }

  const syncRoomCallPeerTracks = async (roomCallId: string, localStreams: RoomCallLocalMediaStreamList) => {
    captureRoomCallPeerDiagnostic('peer-local-tracks-sync-started', {
      ...buildRoomCallLocalTrackIdDiagnostics(localStreams),
      localStreams: buildRoomCallLocalStreamsDiagnostics(localStreams),
      peerUserIds: Array.from(peerConnectionByUserId.keys()),
      roomCallId
    })
    await Promise.all(
      Array.from(peerConnectionByUserId.keys()).map(async (userId) => {
        await enqueueRoomCallPeerTask(userId, async () => {
          const peerConnection = peerConnectionByUserId.get(userId)

          if (!peerConnection) {
            return
          }

          const hasTrackChanges = await syncRoomCallPeerLocalTracks(peerConnection, localStreams)

          if (hasTrackChanges) {
            await createRoomCallPeerOffer(roomCallId, userId, localStreams)
          }
        })
      })
    )
  }

  const resetRoomCallPeers = () => {
    captureRoomCallPeerDiagnostic('peer-reset-started', {
      peerUserIds: Array.from(peerConnectionByUserId.keys())
    })
    Array.from(peerConnectionByUserId.keys()).forEach((userId) => {
      closeRoomCallPeer(userId)
    })
    iceCandidatesByUserId.clear()
    peerConnectionWatchdogStopByUserId.forEach((stop) => stop())
    peerConnectionWatchdogStopByUserId.clear()
    peerTaskByUserId.clear()
    makingOfferByUserId.clear()
    recoveringPeerUserIds.clear()
    localUserId = null
    roomCallRtcConfiguration = ROOM_CALL_RTC_CONFIGURATION
    pauseConnectionQualityMonitor()
    captureRoomCallDiagnostic('peer-reset-finished')
  }

  return {
    connectionQualityByUserId,
    remoteStreamsByUserId,
    connectRoomCallPeers,
    handleRoomCallSignalReceived,
    syncRoomCallPeerTracks,
    setRoomCallPeerRtcConfiguration,
    resetRoomCallPeers
  }
}
