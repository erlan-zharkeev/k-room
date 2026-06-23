import { ROOM_CALL_SCREEN_TILE_ID_SUFFIX } from '../config/constants'
import type { BuildRoomCallTileItemsParams, RoomCallTileItem } from '../config/types'

const buildRoomCallScreenTileId = (userId: string) => `${userId}:${ROOM_CALL_SCREEN_TILE_ID_SUFFIX}`

const buildMediaStreamFromTracks = (tracks: MediaStreamTrack[]) => {
  if (!tracks.length) {
    return undefined
  }

  return new MediaStream(tracks)
}

const buildRoomCallParticipantTileMediaState = (mediaState: RoomCallTileItem['mediaState']) => ({
  ...mediaState,
  screen: false
})

const buildRoomCallScreenTileMediaState = (mediaState: RoomCallTileItem['mediaState']) => ({
  ...mediaState,
  audio: false,
  video: false
})

const sortPrivateRoomCallTileItems = (items: RoomCallTileItem[]) => {
  return [...items].sort((left, right) => Number(right.isLocal) - Number(left.isLocal))
}

const resolveRemoteRoomCallParticipantStream = (
  stream: MediaStream | undefined,
  mediaState: RoomCallTileItem['mediaState']
) => {
  if (!stream) {
    return undefined
  }

  const tracks = [...stream.getAudioTracks()]
  const [cameraVideoTrack] = stream.getVideoTracks()

  if (mediaState.video && cameraVideoTrack) {
    tracks.push(cameraVideoTrack)
  }

  return buildMediaStreamFromTracks(tracks)
}

const resolveRemoteRoomCallScreenStream = (stream: MediaStream | undefined) => {
  if (!stream) {
    return undefined
  }

  const videoTracks = stream.getVideoTracks()
  const screenVideoTrack = videoTracks.length > 1 ? videoTracks[videoTracks.length - 1] : videoTracks[0]

  return screenVideoTrack ? buildMediaStreamFromTracks([screenVideoTrack]) : undefined
}

export const buildRoomCallTileItems = ({
  audioStream,
  connectionQualityByUserId,
  currentUserId,
  handRaisedByUserId,
  localMediaState,
  remoteStreamsByUserId,
  resolveParticipantAvatarId,
  resolveParticipantName,
  roomCall,
  screenStream,
  temporaryQuickCommandByUserId,
  videoStream
}: BuildRoomCallTileItemsParams): RoomCallTileItem[] => {
  const items = roomCall.participants
    .filter(({ leftAt }) => !leftAt)
    .map<RoomCallTileItem>((participant) => {
      const isLocal = participant.userId === currentUserId
      const mediaState = isLocal ? localMediaState : participant.mediaState
      const remoteStream = remoteStreamsByUserId[participant.userId]
      const connectionQuality = connectionQualityByUserId[participant.userId]
      const stream = isLocal
        ? videoStream || undefined
        : resolveRemoteRoomCallParticipantStream(remoteStream, mediaState)
      const audioActivityStream = isLocal ? audioStream : remoteStream
      const participantTileMediaState = buildRoomCallParticipantTileMediaState(mediaState)
      const mirrored = isLocal && Boolean(videoStream)

      return {
        audioActivityStream,
        avatarId: resolveParticipantAvatarId(participant.userId),
        connectionQuality,
        id: participant.userId,
        isHandRaised: Boolean(handRaisedByUserId[participant.userId]),
        isLocal,
        kind: 'participant',
        mediaState: participantTileMediaState,
        mirrored,
        name: resolveParticipantName(participant.userId),
        stream,
        temporaryQuickCommand: temporaryQuickCommandByUserId[participant.userId]
      }
    })

  const screenItems = roomCall.participants
    .filter(({ leftAt }) => !leftAt)
    .flatMap<RoomCallTileItem>((participant) => {
      const isLocal = participant.userId === currentUserId
      const mediaState = isLocal ? localMediaState : participant.mediaState
      const remoteStream = remoteStreamsByUserId[participant.userId]
      const connectionQuality = connectionQualityByUserId[participant.userId]

      if (!mediaState.screen) {
        return []
      }

      return [
        {
          avatarId: resolveParticipantAvatarId(participant.userId),
          connectionQuality,
          id: buildRoomCallScreenTileId(participant.userId),
          isHandRaised: false,
          isLocal,
          kind: 'screen',
          mediaState: buildRoomCallScreenTileMediaState(mediaState),
          mirrored: false,
          name: resolveParticipantName(participant.userId),
          stream: isLocal ? screenStream || undefined : resolveRemoteRoomCallScreenStream(remoteStream)
        }
      ]
    })
  const sortedItems = items.length === 2 ? sortPrivateRoomCallTileItems(items) : items

  return [...screenItems, ...sortedItems]
}
