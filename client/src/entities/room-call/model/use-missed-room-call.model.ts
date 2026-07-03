import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import { isIncomingMissedRoomCall } from '../lib/room-call-state'

import { useRoomCall } from './use-room-call.model'

export const useMissedRoomCall = (
  currentUserId: MaybeRefOrGetter<string>,
  lastSeenMissedRoomCallCalledAt: MaybeRefOrGetter<number>
) => {
  const { roomCalls } = useRoomCall()

  const missedRoomCalls = computed(() =>
    roomCalls.value.filter((roomCall) => isIncomingMissedRoomCall(roomCall, toValue(currentUserId)))
  )
  const unseenMissedRoomCallQuantity = computed(() => {
    const lastSeenCalledAt = toValue(lastSeenMissedRoomCallCalledAt)

    return missedRoomCalls.value.filter((roomCall) => roomCall.calledAt > lastSeenCalledAt).length
  })
  const lastMissedRoomCallCalledAt = computed(() =>
    missedRoomCalls.value.reduce((calledAt, roomCall) => Math.max(calledAt, roomCall.calledAt), 0)
  )

  return {
    missedRoomCalls,
    unseenMissedRoomCallQuantity,
    lastMissedRoomCallCalledAt
  }
}
