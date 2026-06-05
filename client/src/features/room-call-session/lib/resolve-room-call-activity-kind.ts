import { ROOM_CALL_STATUS } from 'global-shared'

import { ROOM_CALL_ACTIVITY_KIND } from '../config/constants'
import type { ResolveRoomCallActivityKindParams } from '../config/types'

export const resolveRoomCallActivityKind = ({
  activeRoomCallId,
  currentUserId,
  roomCall
}: ResolveRoomCallActivityKindParams) => {
  const isCallingRoomCall = roomCall.status === ROOM_CALL_STATUS.CALLING
  const initiatedByCurrentUser = roomCall.initiatorId === currentUserId

  if (isCallingRoomCall && initiatedByCurrentUser) return ROOM_CALL_ACTIVITY_KIND.OUTGOING
  if (isCallingRoomCall) return ROOM_CALL_ACTIVITY_KIND.INCOMING

  const isActiveSessionRoomCall = roomCall.id === activeRoomCallId

  if (isActiveSessionRoomCall) return ROOM_CALL_ACTIVITY_KIND.ACTIVE

  return ROOM_CALL_ACTIVITY_KIND.JOINABLE
}
