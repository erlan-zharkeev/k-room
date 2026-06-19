import type { ResolveRoomCallActivityKindParams } from '../config/types'

export const resolveRoomCallActivityKind = ({
  activeRoomCallId,
  currentUserId,
  roomCall
}: ResolveRoomCallActivityKindParams) => {
  const isCallingRoomCall = roomCall.status === 'calling'
  const initiatedByCurrentUser = roomCall.initiatorId === currentUserId

  if (isCallingRoomCall && initiatedByCurrentUser) return 'outgoing'
  if (isCallingRoomCall) return 'incoming'

  const isActiveSessionRoomCall = roomCall.id === activeRoomCallId

  if (isActiveSessionRoomCall) return 'active'

  return 'joinable'
}
