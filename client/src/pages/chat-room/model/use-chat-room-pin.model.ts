import { PINNED_CHAT_ROOM_LIMIT, type EventUpdatePinnedChatRoom } from 'global-shared'
import { computed, ref, type Ref } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useSocketAction } from 'src/shared/api'

import type { ChatRoomNavigationItem } from '../config/types'

export const useChatRoomPin = (item: Ref<ChatRoomNavigationItem>) => {
  const { chatRooms } = useChatRoom()
  const { emitSocketAction } = useSocketAction()
  const isUpdatingPinnedChatRoom = ref(false)
  const pinnedChatRoomCount = computed(() => chatRooms.value.filter(({ isPinned }) => isPinned).length)
  const canUpdatePinnedChatRoom = computed(
    () => !isUpdatingPinnedChatRoom.value && (item.value.isPinned || pinnedChatRoomCount.value < PINNED_CHAT_ROOM_LIMIT)
  )

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
