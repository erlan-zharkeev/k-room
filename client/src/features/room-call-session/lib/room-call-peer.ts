import type { RoomCallParticipant } from 'global-shared'

import type { RoomCallLocalMediaStreamList, RoomCallLocalTrackEntry } from '../config/types'

export const collectRoomCallLocalTrackEntries = (streams: RoomCallLocalMediaStreamList) => {
  return streams.flatMap((stream): RoomCallLocalTrackEntry[] => {
    if (!stream) {
      return []
    }

    return stream.getTracks().map((track) => ({
      stream,
      track
    }))
  })
}

export const syncRoomCallPeerLocalTracks = (
  peerConnection: RTCPeerConnection,
  streams: RoomCallLocalMediaStreamList
) => {
  let hasTrackChanges = false
  const trackEntries = collectRoomCallLocalTrackEntries(streams)
  const localTrackIds = new Set(trackEntries.map(({ track }) => track.id))

  peerConnection.getSenders().forEach((sender) => {
    if (sender.track && !localTrackIds.has(sender.track.id)) {
      peerConnection.removeTrack(sender)
      hasTrackChanges = true
    }
  })

  const senderTrackIds = new Set(peerConnection.getSenders().flatMap(({ track }) => (track ? [track.id] : [])))

  trackEntries.forEach(({ stream, track }) => {
    if (!senderTrackIds.has(track.id)) {
      peerConnection.addTrack(track, stream)
      hasTrackChanges = true
    }
  })

  return hasTrackChanges
}

export const appendRoomCallRemoteTrack = (stream: MediaStream, track: MediaStreamTrack) => {
  const hasTrack = stream.getTracks().some(({ id }) => id === track.id)

  if (!hasTrack) {
    stream.addTrack(track)
  }
}

export const removeRoomCallRemoteTrack = (stream: MediaStream, track: MediaStreamTrack) => {
  const hasTrack = stream.getTracks().some(({ id }) => id === track.id)

  if (hasTrack) {
    stream.removeTrack(track)
  }
}

export const shouldCreateRoomCallPeerOffer = (currentUserId: string, targetUserId: string) =>
  currentUserId < targetUserId

export const resolveRoomCallPeerParticipantIds = (currentUserId: string, participants: RoomCallParticipant[]) => {
  return participants.flatMap(({ leftAt, userId }) => {
    const isCurrentUser = userId === currentUserId
    const isActiveParticipant = !leftAt

    return isCurrentUser || !isActiveParticipant ? [] : [userId]
  })
}

export const isClosedRoomCallPeerConnection = (peerConnection: RTCPeerConnection) => {
  const isClosed = peerConnection.connectionState === 'closed'
  const isDisconnected = peerConnection.connectionState === 'disconnected'
  const isFailed = peerConnection.connectionState === 'failed'

  return isClosed || isDisconnected || isFailed
}
