import type { EventUpdateMutedChatRoom } from 'global-shared'
import { computed, ref, type Ref } from 'vue'

import { useSocketAction } from 'src/shared/api'

import type { ChatRoomContextMenuItem } from '../config/types'

export const useChatRoomMute = (item: Readonly<Ref<ChatRoomContextMenuItem>>) => {
  const { emitSocketAction } = useSocketAction()
  const isUpdatingMutedChatRoom = ref(false)
  const canUpdateMutedChatRoom = computed(() => !isUpdatingMutedChatRoom.value)

  const toggleMutedChatRoom = () => {
    if (!canUpdateMutedChatRoom.value) return

    const payload: EventUpdateMutedChatRoom = {
      roomId: item.value.id,
      isMuted: !item.value.isMuted
    }

    isUpdatingMutedChatRoom.value = true
    void emitSocketAction<EventUpdateMutedChatRoom>('update-muted-chat-room', payload, {
      onSettled: () => {
        isUpdatingMutedChatRoom.value = false
      }
    })
  }

  return {
    canUpdateMutedChatRoom,
    isUpdatingMutedChatRoom,
    toggleMutedChatRoom
  }
}
