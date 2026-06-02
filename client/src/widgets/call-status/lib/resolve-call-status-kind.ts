import { ROOM_CALL_STATUS } from 'global-shared'

import { CALL_STATUS_KIND } from '../config/constants'
import type { ResolveCallStatusKindParams } from '../config/types'

export const resolveCallStatusKind = ({ activeRoomCallId, currentUserId, roomCall }: ResolveCallStatusKindParams) => {
  const isCallingRoomCall = roomCall.status === ROOM_CALL_STATUS.CALLING
  const initiatedByCurrentUser = roomCall.initiatorId === currentUserId

  if (isCallingRoomCall && initiatedByCurrentUser) return CALL_STATUS_KIND.OUTGOING
  if (isCallingRoomCall) return CALL_STATUS_KIND.INCOMING

  const isActiveSessionRoomCall = roomCall.id === activeRoomCallId

  if (isActiveSessionRoomCall) return CALL_STATUS_KIND.ACTIVE

  return CALL_STATUS_KIND.JOINABLE
}
