import { computed, toRef } from 'vue'

import type { RoomCallAudioContextMenuItemEmit, RoomCallAudioContextMenuItemProps } from '../config/types'

import { useActiveRoomCallSession } from './use-active-room-call-session.model'

export const useRoomCallAudioContextMenuItem = (
  props: RoomCallAudioContextMenuItemProps,
  emit: RoomCallAudioContextMenuItemEmit
) => {
  const roomId = toRef(props, 'roomId')
  const { canStartActiveRoomCall, startActiveRoomCall } = useActiveRoomCallSession()
  const isRoomCallAudioContextMenuItemDisabled = computed(() => !canStartActiveRoomCall(roomId.value))

  const startAudioRoomCall = async () => {
    if (isRoomCallAudioContextMenuItemDisabled.value) {
      return null
    }

    const roomCallId = await startActiveRoomCall(roomId.value, 'audio')

    emit('select')

    return roomCallId
  }

  return {
    isRoomCallAudioContextMenuItemDisabled,
    startAudioRoomCall
  }
}
