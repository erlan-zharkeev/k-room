import type { RoomCallMediaKind, RoomCallParticipantMediaState } from 'global-shared'

export const resolveRoomCallMediaKind = (
  currentMediaKind: RoomCallMediaKind,
  mediaState: RoomCallParticipantMediaState
): RoomCallMediaKind => {
  if (currentMediaKind === 'screen' || mediaState.screen) return 'screen'
  if (currentMediaKind === 'video' || mediaState.video) return 'video'

  return currentMediaKind
}
