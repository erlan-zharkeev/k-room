import { type RoomCall, type RoomCallMediaKind } from 'global-shared'

export const resolveRoomCallJoinMediaKind = (roomCall: Pick<RoomCall, 'mediaKind'>, mediaKind?: RoomCallMediaKind) => {
  if (mediaKind) {
    return mediaKind
  }

  if (roomCall.mediaKind === 'screen') {
    return 'audio'
  }

  return roomCall.mediaKind
}
