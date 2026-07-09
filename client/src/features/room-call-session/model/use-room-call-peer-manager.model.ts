import { useIntervalFn, useTimeoutFn } from '@vueuse/core'
import { type EventRoomCallSignalReceived, type RoomCallSignalKind } from 'global-shared'
import { shallowRef } from 'vue'

import {
  ROOM_CALL_CONNECTION_QUALITY_CHECK_INTERVAL_MS,
  ROOM_CALL_PEER_CREATE_ANSWER_TIMEOUT_MS,
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
  const makingOfferByUserId = new Set<string>()
  const remoteStreamsByUserId = shallowRef<RoomCallRemoteStreamsByUserId>({})
  const connectionQualityByUserId = shallowRef<RoomCallConnectionQualityByUserId>({})
  let localUserId: string | null = null
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

  const sendPeerSignal = (roomCallId: string, toUserId: string, signalKind: RoomCallSignalKind, signal: unknown) => {
    sendRoomCallSignal({
      roomCallId,
      signal,
      signalKind,
      toUserId
    })
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
      await peerConnection.setLocalDescription({ type: 'rollback' })
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
      await peerConnection.addIceCandidate(candidate)
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

    const peerConnection = new RTCPeerConnection(ROOM_CALL_RTC_CONFIGURATION)

    await syncRoomCallPeerLocalTracks(peerConnection, localStreams)
    peerConnection.addEventListener('icecandidate', ({ candidate }) => {
      if (candidate) {
        incrementPeerCounter(generatedIceCandidateCountByUserId, userId)
        sendPeerSignal(roomCallId, userId, 'ice-candidate', candidate.toJSON())
        return
      }
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
      void syncRoomCallConnectionQuality(userId, peerConnection)

      if (isClosedRoomCallPeerConnection(peerConnection)) {
        closeRoomCallPeer(userId)
      }
    })
    peerConnectionByUserId.set(userId, peerConnection)
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
      const offer = await peerConnection.createOffer()
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

      await peerConnection.setLocalDescription(offer)
      captureRoomCallPeerDiagnostic('peer-offer-local-description-set', {
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId,
        signal: buildRoomCallSignalDiagnostics(offer),
        toUserId
      })

      const localDescription = peerConnection.localDescription

      if (localDescription) {
        sendPeerSignal(roomCallId, toUserId, 'offer', localDescription.toJSON())
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
    captureRoomCallPeerDiagnostic('peer-connection-recover-started', {
      localStreams: buildRoomCallLocalStreamsDiagnostics(localStreams),
      roomCallId,
      userId
    })
    closeRoomCallPeer(userId, false)

    const peerConnection = await ensureRoomCallPeerConnection(roomCallId, userId, localStreams)

    await createAndSendRoomCallPeerOffer(roomCallId, userId, peerConnection)
    captureRoomCallPeerDiagnostic('peer-connection-recover-finished', {
      peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
      roomCallId,
      userId
    })
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
      await peerConnection.setRemoteDescription(payload.signal)
      captureRoomCallPeerDiagnostic('peer-offer-remote-description-set', {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signal: buildRoomCallSignalDiagnostics(payload.signal)
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
      const answer = await withRoomCallPeerTimeout(
        peerConnection.createAnswer(),
        ROOM_CALL_PEER_CREATE_ANSWER_TIMEOUT_MS,
        () => {
          captureRoomCallPeerDiagnostic(
            'peer-answer-create-timeout',
            {
              fromUserId: payload.fromUserId,
              peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
              roomCallId: payload.roomCallId,
              timeoutMs: ROOM_CALL_PEER_CREATE_ANSWER_TIMEOUT_MS
            },
            'warning'
          )
        }
      )
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
      await peerConnection.setLocalDescription(answer)
      captureRoomCallPeerDiagnostic('peer-answer-local-description-set', {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signal: buildRoomCallSignalDiagnostics(answer)
      })
      await flushRoomCallPeerIceCandidates(payload.fromUserId, peerConnection)

      const localDescription = peerConnection.localDescription

      if (localDescription) {
        sendPeerSignal(payload.roomCallId, payload.fromUserId, 'answer', localDescription.toJSON())
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
      await peerConnection.setRemoteDescription(payload.signal)
      captureRoomCallPeerDiagnostic('peer-answer-remote-description-set', {
        fromUserId: payload.fromUserId,
        peer: buildRoomCallPeerConnectionDiagnostics(peerConnection),
        roomCallId: payload.roomCallId,
        signal: buildRoomCallSignalDiagnostics(payload.signal)
      })
      await flushRoomCallPeerIceCandidates(payload.fromUserId, peerConnection)
    } catch (error) {
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
          await addRoomCallPeerIceCandidate(payload)
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
    peerTaskByUserId.clear()
    makingOfferByUserId.clear()
    localUserId = null
    pauseConnectionQualityMonitor()
    captureRoomCallDiagnostic('peer-reset-finished')
  }

  return {
    connectionQualityByUserId,
    remoteStreamsByUserId,
    connectRoomCallPeers,
    handleRoomCallSignalReceived,
    syncRoomCallPeerTracks,
    resetRoomCallPeers
  }
}
