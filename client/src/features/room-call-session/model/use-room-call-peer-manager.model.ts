import { ROOM_CALL_SIGNAL_KIND, type EventRoomCallSignalReceived } from 'global-shared'
import { shallowRef } from 'vue'

import type {
  ConnectRoomCallPeersParams,
  RoomCallLocalMediaStreamList,
  RoomCallRemoteStreamsByUserId
} from '../config/types'
import {
  appendRoomCallRemoteTrack,
  isClosedRoomCallPeerConnection,
  removeRoomCallRemoteTrack,
  resolveRoomCallPeerParticipantIds,
  shouldCreateRoomCallPeerOffer,
  syncRoomCallPeerLocalTracks
} from '../lib/room-call-peer'
import {
  isRoomCallIceCandidateSignal,
  isRoomCallSessionDescriptionSignal
} from '../lib/room-call-peer-signal'

import { useRoomCallSession } from './use-room-call-session.model'

export const useRoomCallPeerManager = () => {
  const peerConnectionByUserId = new Map<string, RTCPeerConnection>()
  const remoteStreamsByUserId = shallowRef<RoomCallRemoteStreamsByUserId>({})
  const { sendRoomCallSignal } = useRoomCallSession()

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

  const sendPeerSignal = (
    roomCallId: string,
    toUserId: string,
    signalKind: typeof ROOM_CALL_SIGNAL_KIND[keyof typeof ROOM_CALL_SIGNAL_KIND],
    signal: unknown
  ) => {
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
    removeRemoteStream(userId)
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

    const peerConnection = new RTCPeerConnection()

    syncRoomCallPeerLocalTracks(peerConnection, localStreams)
    peerConnection.addEventListener('icecandidate', ({ candidate }) => {
      if (candidate) {
        sendPeerSignal(roomCallId, userId, ROOM_CALL_SIGNAL_KIND.ICE_CANDIDATE, candidate.toJSON())
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
      if (isClosedRoomCallPeerConnection(peerConnection)) {
        closeRoomCallPeer(userId)
      }
    })
    peerConnectionByUserId.set(userId, peerConnection)

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
    sendPeerSignal(roomCallId, toUserId, ROOM_CALL_SIGNAL_KIND.OFFER, offer)
  }

  const answerRoomCallPeerOffer = async (
    payload: EventRoomCallSignalReceived,
    localStreams: RoomCallLocalMediaStreamList
  ) => {
    if (!isRoomCallSessionDescriptionSignal(payload.signal, ROOM_CALL_SIGNAL_KIND.OFFER)) {
      return
    }

    const peerConnection = ensureRoomCallPeerConnection(payload.roomCallId, payload.fromUserId, localStreams)

    await peerConnection.setRemoteDescription(payload.signal)

    const answer = await peerConnection.createAnswer()

    await peerConnection.setLocalDescription(answer)
    sendPeerSignal(payload.roomCallId, payload.fromUserId, ROOM_CALL_SIGNAL_KIND.ANSWER, answer)
  }

  const acceptRoomCallPeerAnswer = async (payload: EventRoomCallSignalReceived) => {
    const peerConnection = peerConnectionByUserId.get(payload.fromUserId)

    if (!peerConnection || !isRoomCallSessionDescriptionSignal(payload.signal, ROOM_CALL_SIGNAL_KIND.ANSWER)) {
      return
    }

    await peerConnection.setRemoteDescription(payload.signal)
  }

  const addRoomCallPeerIceCandidate = async (payload: EventRoomCallSignalReceived) => {
    const peerConnection = peerConnectionByUserId.get(payload.fromUserId)

    if (!peerConnection || !isRoomCallIceCandidateSignal(payload.signal)) {
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
      case ROOM_CALL_SIGNAL_KIND.OFFER:
        await answerRoomCallPeerOffer(payload, localStreams)
        break
      case ROOM_CALL_SIGNAL_KIND.ANSWER:
        await acceptRoomCallPeerAnswer(payload)
        break
      case ROOM_CALL_SIGNAL_KIND.ICE_CANDIDATE:
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
  }

  return {
    remoteStreamsByUserId,
    connectRoomCallPeers,
    createRoomCallPeerOffer,
    handleRoomCallSignalReceived,
    syncRoomCallPeerParticipants,
    syncRoomCallPeerTracks,
    closeRoomCallPeer,
    resetRoomCallPeers
  }
}
