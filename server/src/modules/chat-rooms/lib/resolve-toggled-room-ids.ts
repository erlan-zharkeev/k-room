import intersection from 'lodash/intersection'
import union from 'lodash/union'
import without from 'lodash/without'

export const resolveToggledRoomIds = (currentIds: string[], roomId: string, enabled: boolean) => {
  if (!enabled) return without(currentIds, roomId)

  return [roomId, ...without(currentIds, roomId)]
}

export const resolvePinnedChatRoomOrder = (currentIds: string[], incomingIds: string[]) => {
  const orderedIds = intersection(incomingIds, currentIds)

  return union(orderedIds, currentIds)
}
