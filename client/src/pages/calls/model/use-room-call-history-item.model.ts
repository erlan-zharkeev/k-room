import { computed } from 'vue'

import type { RoomCallHistoryItemEmit, RoomCallHistoryItemProps } from '../config/types'

export const useRoomCallHistoryItem = (props: RoomCallHistoryItemProps, emit: RoomCallHistoryItemEmit) => {
  const isRoomCallHistoryItemInteractive = computed(() => props.item.canStartCall)
  const roomCallHistoryItemAriaDisabled = computed(() => (isRoomCallHistoryItemInteractive.value ? undefined : true))
  const roomCallHistoryItemRole = computed(() => (isRoomCallHistoryItemInteractive.value ? 'button' : undefined))
  const roomCallHistoryItemTabindex = computed(() => (isRoomCallHistoryItemInteractive.value ? 0 : undefined))

  const startRoomCallHistoryItem = () => {
    if (!isRoomCallHistoryItemInteractive.value) {
      return
    }

    emit('start-room-call', props.item)
  }

  return {
    isRoomCallHistoryItemInteractive,
    roomCallHistoryItemAriaDisabled,
    roomCallHistoryItemRole,
    roomCallHistoryItemTabindex,
    startRoomCallHistoryItem
  }
}
