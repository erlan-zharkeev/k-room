import type { EventUpdatePinnedChatRoom } from 'global-shared'
import { computed, ref, type Ref } from 'vue'

import { useSocketAction } from 'src/shared/api'

import type { ChatRoomNavigationItem } from '../config/types'

export const useChatRoomPin = (item: Ref<ChatRoomNavigationItem>) => {
  const { emitSocketAction } = useSocketAction()
  const isUpdatingPinnedChatRoom = ref(false)
  const canUpdatePinnedChatRoom = computed(() => !isUpdatingPinnedChatRoom.value)

  const togglePinnedChatRoom = () => {
    if (!canUpdatePinnedChatRoom.value) return

    const payload: EventUpdatePinnedChatRoom = {
      roomId: item.value.id,
      isPinned: !item.value.isPinned
    }

    isUpdatingPinnedChatRoom.value = true
    void emitSocketAction<EventUpdatePinnedChatRoom>('update-pinned-chat-room', payload, {
      onSettled: () => {
        isUpdatingPinnedChatRoom.value = false
      }
    })
  }

  return {
    isUpdatingPinnedChatRoom,
    canUpdatePinnedChatRoom,
    togglePinnedChatRoom
  }
}
