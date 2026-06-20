import { useIntervalFn } from '@vueuse/core'
import { type EventRoomCallSignalReceived, type RoomCallSignalKind } from 'global-shared'
import { shallowRef } from 'vue'

import { ROOM_CALL_CONNECTION_QUALITY_CHECK_INTERVAL_MS, ROOM_CALL_RTC_CONFIGURATION } from '../config/constants'
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
import { isRoomCallIceCandidateSignal, isRoomCallSessionDescriptionSignal } from '../lib/room-call-peer-signal'

import { useRoomCallSession } from './use-room-call-session.model'

export const useRoomCallPeerManager = () => {
  const peerConnectionByUserId = new Map<string, RTCPeerConnection>()
  const iceCandidatesByUserId = new Map<string, RTCIceCandidateInit[]>()
  const remoteStreamsByUserId = shallowRef<RoomCallRemoteStreamsByUserId>({})
  const connectionQualityByUserId = shallowRef<RoomCallConnectionQualityByUserId>({})
  const { sendRoomCallSignal } = useRoomCallSession()
  const { pause: pauseConnectionQualityMonitor, resume: resumeConnectionQualityMonitor } = useIntervalFn(
    () => {
      void syncRoomCallConnectionQualities()
    },
    ROOM_CALL_CONNECTION_QUALITY_CHECK_INTERVAL_MS,
    { immediate: false, immediateCallback: false }
  )

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

  const sendPeerSignal = (roomCallId: string, toUserId: string, signalKind: RoomCallSignalKind, signal: unknown) => {
    sendRoomCallSignal({
      roomCallId,
      signal,
      signalKind,
      toUserId
    })
  }

  const closeRoomCallPeer = (userId: string) => {
    const peerConnection = peerConnectionByUserId.get(userId)

    if (!peerConnection) {
      return
    }

    peerConnection.close()
    peerConnectionByUserId.delete(userId)
    iceCandidatesByUserId.delete(userId)
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

    await Promise.all(candidates.map((candidate) => peerConnection.addIceCandidate(candidate)))
    iceCandidatesByUserId.delete(userId)
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

  const ensureRoomCallPeerConnection = (
    roomCallId: string,
    userId: string,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    const currentPeerConnection = peerConnectionByUserId.get(userId)

    if (currentPeerConnection) {
      syncRoomCallPeerLocalTracks(currentPeerConnection, localStreams)
      return currentPeerConnection
    }

    const peerConnection = new RTCPeerConnection(ROOM_CALL_RTC_CONFIGURATION)

    syncRoomCallPeerLocalTracks(peerConnection, localStreams)
    peerConnection.addEventListener('icecandidate', ({ candidate }) => {
      if (candidate) {
        sendPeerSignal(roomCallId, userId, 'ice-candidate', candidate.toJSON())
      }
    })
    peerConnection.addEventListener('track', ({ track }) => {
      const remoteStream = remoteStreamsByUserId.value[userId] ?? new MediaStream()

      appendRoomCallRemoteTrack(remoteStream, track)
      updateRemoteStream(userId, remoteStream)
      track.addEventListener(
        'ended',
        () => {
          removeRoomCallRemoteTrack(remoteStream, track)
          updateRemoteStream(userId, remoteStream)
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

  const createRoomCallPeerOffer = async (
    roomCallId: string,
    toUserId: string,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    const peerConnection = ensureRoomCallPeerConnection(roomCallId, toUserId, localStreams)
    const offer = await peerConnection.createOffer()

    await peerConnection.setLocalDescription(offer)
    sendPeerSignal(roomCallId, toUserId, 'offer', offer)
  }

  const answerRoomCallPeerOffer = async (
    payload: EventRoomCallSignalReceived,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    if (!isRoomCallSessionDescriptionSignal(payload.signal, 'offer')) {
      return
    }

    const peerConnection = ensureRoomCallPeerConnection(payload.roomCallId, payload.fromUserId, localStreams)

    await peerConnection.setRemoteDescription(payload.signal)

    const answer = await peerConnection.createAnswer()

    await peerConnection.setLocalDescription(answer)
    await flushRoomCallPeerIceCandidates(payload.fromUserId, peerConnection)
    sendPeerSignal(payload.roomCallId, payload.fromUserId, 'answer', answer)
  }

  const acceptRoomCallPeerAnswer = async (payload: EventRoomCallSignalReceived) => {
    const peerConnection = peerConnectionByUserId.get(payload.fromUserId)

    if (!peerConnection || !isRoomCallSessionDescriptionSignal(payload.signal, 'answer')) {
      return
    }

    await peerConnection.setRemoteDescription(payload.signal)
    await flushRoomCallPeerIceCandidates(payload.fromUserId, peerConnection)
  }

  const addRoomCallPeerIceCandidate = async (payload: EventRoomCallSignalReceived) => {
    const peerConnection = peerConnectionByUserId.get(payload.fromUserId)

    if (!peerConnection || !isRoomCallIceCandidateSignal(payload.signal)) {
      return
    }

    if (!peerConnection.remoteDescription) {
      pushRoomCallPeerIceCandidate(payload.fromUserId, payload.signal)
      return
    }

    await peerConnection.addIceCandidate(payload.signal)
  }

  const handleRoomCallSignalReceived = async (
    payload: EventRoomCallSignalReceived,
    roomCallId: string,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    if (payload.roomCallId !== roomCallId) {
      return
    }

    switch (payload.signalKind) {
      case 'offer':
        await answerRoomCallPeerOffer(payload, localStreams)
        break
      case 'answer':
        await acceptRoomCallPeerAnswer(payload)
        break
      case 'ice-candidate':
        await addRoomCallPeerIceCandidate(payload)
        break
    }
  }

  const connectRoomCallPeers = async ({
    currentUserId,
    localStreams,
    participants,
    roomCallId
  }: ConnectRoomCallPeersParams) => {
    const targetUserIds = syncRoomCallPeerParticipants(currentUserId, participants)

    await Promise.all(
      targetUserIds.map(async (targetUserId) => {
        ensureRoomCallPeerConnection(roomCallId, targetUserId, localStreams)

        if (shouldCreateRoomCallPeerOffer(currentUserId, targetUserId)) {
          await createRoomCallPeerOffer(roomCallId, targetUserId, localStreams)
        }
      })
    )
  }

  const syncRoomCallPeerTracks = async (roomCallId: string, localStreams: RoomCallLocalMediaStreamList) => {
    await Promise.all(
      Array.from(peerConnectionByUserId.entries()).map(async ([userId, peerConnection]) => {
        const hasTrackChanges = syncRoomCallPeerLocalTracks(peerConnection, localStreams)

        if (hasTrackChanges) {
          await createRoomCallPeerOffer(roomCallId, userId, localStreams)
        }
      })
    )
  }

  const resetRoomCallPeers = () => {
    Array.from(peerConnectionByUserId.keys()).forEach(closeRoomCallPeer)
    pauseConnectionQualityMonitor()
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
