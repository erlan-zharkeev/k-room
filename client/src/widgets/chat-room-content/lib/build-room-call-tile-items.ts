import type { BuildRoomCallTileItemsParams, RoomCallTileItem } from '../config/types'

const resolveLocalRoomCallTileStream = ({
  screenStream,
  videoStream
}: Pick<BuildRoomCallTileItemsParams, 'screenStream' | 'videoStream'>) => screenStream || videoStream || undefined

const sortPrivateRoomCallTileItems = (items: RoomCallTileItem[]) => {
  return [...items].sort((left, right) => Number(right.isLocal) - Number(left.isLocal))
}

export const buildRoomCallTileItems = ({
  audioStream,
  currentUserId,
  localMediaState,
  remoteStreamsByUserId,
  resolveParticipantAvatarId,
  resolveParticipantName,
  roomCall,
  screenStream,
  videoStream
}: BuildRoomCallTileItemsParams): RoomCallTileItem[] => {
  const items = roomCall.participants
    .filter(({ leftAt }) => !leftAt)
    .map<RoomCallTileItem>((participant) => {
      const isLocal = participant.userId === currentUserId
      const stream = isLocal
        ? resolveLocalRoomCallTileStream({ screenStream, videoStream })
        : remoteStreamsByUserId[participant.userId]
      const audioActivityStream = isLocal ? audioStream : stream
      const mediaState = isLocal ? localMediaState : participant.mediaState
      const mirrored = isLocal && Boolean(videoStream) && !screenStream

      return {
        audioActivityStream,
        avatarId: resolveParticipantAvatarId(participant.userId),
        id: participant.userId,
        isLocal,
        mediaState,
        mirrored,
        name: resolveParticipantName(participant.userId),
        stream
      }
    })

  return items.length === 2 ? sortPrivateRoomCallTileItems(items) : items
}
