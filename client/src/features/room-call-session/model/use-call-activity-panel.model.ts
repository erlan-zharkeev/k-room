import { computed, toRef } from 'vue'

import type { CallActivityPanelEmit, CallActivityPanelProps } from '../config/types'

import { useRoomCallActivity } from './use-room-call-activity.model'

export const useCallActivityPanel = (props: CallActivityPanelProps, emit: CallActivityPanelEmit) => {
  const roomId = toRef(props, 'roomId')
  const isOpenEnabled = computed(() => props.openable !== false)
  const activity = useRoomCallActivity({
    roomId,
    isOpenEnabled,
    openRoomCall: (targetRoomId) => emit('open-room-call', targetRoomId)
  })
  const hasMultipleActivityItems = computed(() => activity.activityItems.value.length > 1)

  return {
    ...activity,
    hasMultipleActivityItems
  }
}
