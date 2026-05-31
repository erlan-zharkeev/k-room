import type { EventUpdatePinnedMessage } from 'global-shared'
import { computed, ref, type Ref } from 'vue'

import { useSocketAction } from 'src/shared/api'
import type { ChatRoomRecord, MessageRecord } from 'src/shared/lib'

export const useMessagePin = (message: Ref<MessageRecord>, room: Ref<ChatRoomRecord>) => {
  const { emitSocketAction } = useSocketAction()
  const isUpdatingPinnedMessage = ref(false)
  const isMessagePinned = computed(() => room.value.pinnedMessageId === message.value.id)
  const canUpdatePinnedMessage = computed(() => !isUpdatingPinnedMessage.value)

  const togglePinnedMessage = () => {
    if (!canUpdatePinnedMessage.value) return

    const payload: EventUpdatePinnedMessage = {
      roomId: room.value.id,
      messageId: message.value.id,
      isPinned: !isMessagePinned.value
    }

    isUpdatingPinnedMessage.value = true
    void emitSocketAction('update-pinned-message', payload, {
      onSettled: () => {
        isUpdatingPinnedMessage.value = false
      }
    })
  }

  return {
    canUpdatePinnedMessage,
    isMessagePinned,
    isUpdatingPinnedMessage,
    togglePinnedMessage
  }
}
