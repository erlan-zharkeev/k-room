import { ROOM_CALL_MEDIA_KIND, type RoomCall, type RoomCallMediaKind } from 'global-shared'

export const resolveRoomCallJoinMediaKind = (roomCall: Pick<RoomCall, 'mediaKind'>, mediaKind?: RoomCallMediaKind) => {
  if (mediaKind) {
    return mediaKind
  }

  if (roomCall.mediaKind === ROOM_CALL_MEDIA_KIND.SCREEN) {
    return ROOM_CALL_MEDIA_KIND.AUDIO
  }

  return roomCall.mediaKind
}
