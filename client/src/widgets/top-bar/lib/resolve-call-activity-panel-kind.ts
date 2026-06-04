import { ROOM_CALL_STATUS } from 'global-shared'

import { CALL_ACTIVITY_PANEL_KIND } from '../config/constants'
import type { ResolveCallActivityPanelKindParams } from '../config/types'

export const resolveCallActivityPanelKind = ({
  activeRoomCallId,
  currentUserId,
  roomCall
}: ResolveCallActivityPanelKindParams) => {
  const isCallingRoomCall = roomCall.status === ROOM_CALL_STATUS.CALLING
  const initiatedByCurrentUser = roomCall.initiatorId === currentUserId

  if (isCallingRoomCall && initiatedByCurrentUser) return CALL_ACTIVITY_PANEL_KIND.OUTGOING
  if (isCallingRoomCall) return CALL_ACTIVITY_PANEL_KIND.INCOMING

  const isActiveSessionRoomCall = roomCall.id === activeRoomCallId

  if (isActiveSessionRoomCall) return CALL_ACTIVITY_PANEL_KIND.ACTIVE

  return CALL_ACTIVITY_PANEL_KIND.JOINABLE
}
