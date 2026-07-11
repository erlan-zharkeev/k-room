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

import { useRoomCallSession } from './use-room-call-session.model'

const createRoomCallPeerTimeoutError = () => new DOMException('Room call peer operation timed out', 'TimeoutError')

const isRoomCallPeerTimeoutError = (error: unknown) => {
  return error instanceof DOMException && error.name === 'TimeoutError'
}

const withRoomCallPeerTimeout = async <T>(task: Promise<T>, timeoutMs: number) => {
  let stopTimeout: (() => void) | undefined
  const timeoutTask = new Promise<never>((_, reject) => {
    const { stop } = useTimeoutFn(
      () => {
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

  const runRoomCallPeerOperation = <T>(task: Promise<T>) =>
    withRoomCallPeerTimeout(task, ROOM_CALL_PEER_OPERATION_TIMEOUT_MS)

  const setRoomCallPeerRtcConfiguration = (configuration: RoomCallRtcConfiguration) => {
    roomCallRtcConfiguration = configuration
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
      void error
    }
  }

  const syncRoomCallConnectionQualities = async () => {
    await Promise.all(
      Array.from(peerConnectionByUserId.entries()).map(([userId, peerConnection]) =>
        syncRoomCallConnectionQuality(userId, peerConnection)
      )
    )
  }

  const sendPeerSignal = async (
    roomCallId: string,
    toUserId: string,
    signalKind: RoomCallSignalKind,
    signal: unknown
  ) => {
    const signalId = uuidv4()
    const delivered = await sendRoomCallSignal({
      roomCallId,
      signal,
      signalId,
      signalKind,
      toUserId
    })

    return delivered
  }

  const handleRoomCallPeerSignalError = (error: unknown) => {
    if (isExpectedRoomCallPeerSignalError(error)) {
      return
    }

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
        handleRoomCallPeerSignalError(error)
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

    return hasOfferCollision && !isPoliteRoomCallPeer(fromUserId)
  }

  const rollbackRoomCallPeerLocalOffer = async (peerConnection: RTCPeerConnection) => {
    if (peerConnection.signalingState !== 'have-local-offer') {
      return true
    }

    try {
      await runRoomCallPeerOperation(peerConnection.setLocalDescription({ type: 'rollback' }))
      return true
    } catch (error) {
      handleRoomCallPeerSignalError(error)
      return false
    }
  }

  const addRoomCallPeerIceCandidateToConnection = async (
    peerConnection: RTCPeerConnection,
    candidate: RTCIceCandidateInit
  ) => {
    try {
      await runRoomCallPeerOperation(peerConnection.addIceCandidate(candidate))
    } catch (error) {
      handleRoomCallPeerSignalError(error)
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
    removeRemoteStream(userId)
    removeRoomCallConnectionQuality(userId)
    syncRoomCallConnectionQualityMonitor()
  }

  const pushRoomCallPeerIceCandidate = (userId: string, candidate: RTCIceCandidateInit) => {
    const candidates = iceCandidatesByUserId.get(userId) ?? []

    iceCandidatesByUserId.set(userId, [...candidates, candidate])
  }

  const flushRoomCallPeerIceCandidates = async (userId: string, peerConnection: RTCPeerConnection) => {
    const candidates = iceCandidatesByUserId.get(userId) ?? []

    iceCandidatesByUserId.delete(userId)
    await Promise.all(candidates.map((candidate) => addRoomCallPeerIceCandidateToConnection(peerConnection, candidate)))
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
        void sendPeerSignal(roomCallId, userId, 'ice-candidate', candidate.toJSON())
        return
      }
    })
    peerConnection.addEventListener('track', ({ track }) => {
      if (!isCurrentRoomCallPeerConnection(userId, peerConnection)) {
        return
      }

      const remoteStream = remoteStreamsByUserId.value[userId] ?? new MediaStream()

      appendRoomCallRemoteTrack(remoteStream, track)
      updateRemoteStream(userId, remoteStream)
      track.addEventListener(
        'ended',
        () => {
          if (!isCurrentRoomCallPeerConnection(userId, peerConnection)) return

          removeRoomCallRemoteTrack(remoteStream, track)
          syncRemoteStreamAfterTrackRemoval(userId, remoteStream)
        },
        { once: true }
      )
    })
    peerConnection.addEventListener('connectionstatechange', () => {
      if (!isCurrentRoomCallPeerConnection(userId, peerConnection)) {
        return
      }

      void syncRoomCallConnectionQuality(userId, peerConnection)

      if (peerConnection.connectionState === 'connected') {
        peerConnectionWatchdogStopByUserId.get(userId)?.()
        peerConnectionWatchdogStopByUserId.delete(userId)
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
      return
    }

    makingOfferByUserId.add(toUserId)

    try {
      const offer = await runRoomCallPeerOperation(peerConnection.createOffer())

      if (peerConnection.signalingState !== 'stable') {
        return
      }

      await runRoomCallPeerOperation(peerConnection.setLocalDescription(offer))

      const localDescription = peerConnection.localDescription

      if (localDescription) {
        const delivered = await sendPeerSignal(roomCallId, toUserId, 'offer', localDescription.toJSON())

        if (!delivered) {
          throw createRoomCallPeerTimeoutError()
        }

        return
      }
    } finally {
      makingOfferByUserId.delete(toUserId)
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
    try {
      closeRoomCallPeer(userId, false)

      const peerConnection = await ensureRoomCallPeerConnection(roomCallId, userId, localStreams)

      await createAndSendRoomCallPeerOffer(roomCallId, userId, peerConnection)
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
      handleRoomCallPeerSignalError(error)
      return
    }

    await recoverRoomCallPeerConnection(roomCallId, userId, localStreams)
  }

  const createRoomCallPeerOffer = async (
    roomCallId: string,
    toUserId: string,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    const peerConnection = await ensureRoomCallPeerConnection(roomCallId, toUserId, localStreams)

    try {
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
      return
    }

    const peerConnection = await ensureRoomCallPeerConnection(payload.roomCallId, payload.fromUserId, localStreams)

    if (shouldIgnoreRoomCallPeerOfferCollision(payload.fromUserId, peerConnection)) {
      return
    }

    const didRollbackLocalOffer = await rollbackRoomCallPeerLocalOffer(peerConnection)

    if (!didRollbackLocalOffer || !hasRoomCallPeerSignalingState(peerConnection, 'stable')) {
      return
    }

    try {
      await runRoomCallPeerOperation(peerConnection.setRemoteDescription(payload.signal))

      if (!hasRoomCallPeerSignalingState(peerConnection, 'have-remote-offer')) {
        return
      }

      const answer = await runRoomCallPeerOperation(peerConnection.createAnswer())

      if (!hasRoomCallPeerSignalingState(peerConnection, 'have-remote-offer')) {
        return
      }

      await runRoomCallPeerOperation(peerConnection.setLocalDescription(answer))
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
      return
    }

    if (peerConnection.signalingState !== 'have-local-offer') {
      return
    }

    try {
      await runRoomCallPeerOperation(peerConnection.setRemoteDescription(payload.signal))
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
      return
    }

    const peerConnection = peerConnectionByUserId.get(payload.fromUserId)

    if (!peerConnection) {
      pushRoomCallPeerIceCandidate(payload.fromUserId, payload.signal)
      return
    }

    if (!peerConnection.remoteDescription) {
      pushRoomCallPeerIceCandidate(payload.fromUserId, payload.signal)
      return
    }

    await addRoomCallPeerIceCandidateToConnection(peerConnection, payload.signal)
  }

  const handleRoomCallSignalReceived = async (
    payload: EventRoomCallSignalReceived,
    roomCallId: string,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    if (payload.roomCallId !== roomCallId) {
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
