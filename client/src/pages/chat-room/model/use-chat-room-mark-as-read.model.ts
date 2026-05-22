import type { EventMarkRoomAsRead } from 'global-shared'
import { computed, ref, type Ref } from 'vue'

import { useSocketAction } from 'src/shared/api'

import type { ChatRoomNavigationItem } from '../config/types'

export const useChatRoomMarkAsRead = (item: Ref<ChatRoomNavigationItem>) => {
  const { emitSocketAction } = useSocketAction()
  const isMarkingChatRoomAsRead = ref(false)
  const canMarkChatRoomAsRead = computed(() => item.value.unreadMessagesQuantity > 0 && !isMarkingChatRoomAsRead.value)

  const markChatRoomAsRead = () => {
    if (!canMarkChatRoomAsRead.value) return

    const payload: EventMarkRoomAsRead = { roomId: item.value.id }

    isMarkingChatRoomAsRead.value = true
    void emitSocketAction<EventMarkRoomAsRead>('mark-room-as-read', payload, {
      onSettled: () => {
        isMarkingChatRoomAsRead.value = false
      }
    })
  }

  return {
    isMarkingChatRoomAsRead,
    canMarkChatRoomAsRead,
    markChatRoomAsRead
  }
}
