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

export const syncRoomCallPeerLocalTracks = async (
  peerConnection: RTCPeerConnection,
  streams: RoomCallLocalMediaStreamList
) => {
  let hasRenegotiationChanges = false
  const trackEntries = collectRoomCallLocalTrackEntries(streams)
  const localTrackIds = new Set(trackEntries.map(({ track }) => track.id))
  const syncedTrackIds = new Set<string>()
  const senderTrackIds = new Set(peerConnection.getSenders().flatMap(({ track }) => (track ? [track.id] : [])))

  const replaceTrackTasks = peerConnection.getSenders().flatMap((sender) => {
    const currentTrack = sender.track

    if (!currentTrack) return []

    if (localTrackIds.has(currentTrack.id)) {
      syncedTrackIds.add(currentTrack.id)
      return []
    }

    const replacement = trackEntries.find(({ track }) => {
      const isSameKind = track.kind === currentTrack.kind
      const isNewTrack = !senderTrackIds.has(track.id)
      const isAvailable = !syncedTrackIds.has(track.id)

      return isSameKind && isNewTrack && isAvailable
    })

    if (replacement) {
      syncedTrackIds.add(replacement.track.id)
      return [sender.replaceTrack(replacement.track)]
    }

    if (!localTrackIds.has(currentTrack.id)) {
      peerConnection.removeTrack(sender)
      hasRenegotiationChanges = true
    }

    return []
  })

  await Promise.all(replaceTrackTasks)

  const nextSenderTrackIds = new Set(peerConnection.getSenders().flatMap(({ track }) => (track ? [track.id] : [])))

  trackEntries.forEach(({ stream, track }) => {
    if (nextSenderTrackIds.has(track.id) || syncedTrackIds.has(track.id)) {
      return
    }

    peerConnection.addTrack(track, stream)
    hasRenegotiationChanges = true
  })

  return hasRenegotiationChanges
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
  const isFailed = peerConnection.connectionState === 'failed'

  return isClosed || isFailed
}
