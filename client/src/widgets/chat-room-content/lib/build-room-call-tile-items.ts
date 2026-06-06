import type { BuildRoomCallTileItemsParams, RoomCallTileItem } from '../config/types'

const resolveLocalRoomCallTileStream = ({
  screenStream,
  videoStream
}: Pick<BuildRoomCallTileItemsParams, 'screenStream' | 'videoStream'>) => screenStream || videoStream || undefined

export const buildRoomCallTileItems = ({
  currentUserId,
  localMediaState,
  remoteStreamsByUserId,
  resolveParticipantAvatarId,
  resolveParticipantName,
  roomCall,
  screenStream,
  videoStream
}: BuildRoomCallTileItemsParams): RoomCallTileItem[] => {
  return roomCall.participants
    .filter(({ leftAt }) => !leftAt)
    .map<RoomCallTileItem>((participant) => {
      const isLocal = participant.userId === currentUserId
      const stream = isLocal
        ? resolveLocalRoomCallTileStream({ screenStream, videoStream })
        : remoteStreamsByUserId[participant.userId]
      const mediaState = isLocal ? localMediaState : participant.mediaState
      const mirrored = isLocal && Boolean(videoStream) && !screenStream

      return {
        avatarId: resolveParticipantAvatarId(participant.userId),
        id: participant.userId,
        isLocal,
        mediaState,
        mirrored,
        name: resolveParticipantName(participant.userId),
        stream
      }
    })
}
