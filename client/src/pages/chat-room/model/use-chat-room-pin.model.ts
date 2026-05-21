import type { IEventUpdatePinnedChatRoom } from 'global-shared'
import { computed, ref, type Ref } from 'vue'

import { useSocketAction } from 'src/shared/api'

import type { IChatRoomNavigationItem } from '../config/types'

export const useChatRoomPin = (item: Ref<IChatRoomNavigationItem>) => {
  const { emitSocketAction } = useSocketAction()
  const isUpdatingPinnedChatRoom = ref(false)
  const canUpdatePinnedChatRoom = computed(() => !isUpdatingPinnedChatRoom.value)

  const togglePinnedChatRoom = () => {
    if (!canUpdatePinnedChatRoom.value) return

    const payload: IEventUpdatePinnedChatRoom = {
      roomId: item.value.id,
      isPinned: !item.value.isPinned
    }

    isUpdatingPinnedChatRoom.value = true
    void emitSocketAction<IEventUpdatePinnedChatRoom>('update-pinned-chat-room', payload, {
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
