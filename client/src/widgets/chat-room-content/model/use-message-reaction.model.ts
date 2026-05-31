import type { EventAddReaction } from 'global-shared'
import { computed, ref, type Ref } from 'vue'

import { useSocketAction } from 'src/shared/api'
import type { ChatRoomRecord, MessageRecord } from 'src/shared/lib'

export const useMessageReaction = (message: Ref<MessageRecord>, room: Ref<ChatRoomRecord>) => {
  const { emitSocketAction } = useSocketAction()
  const isUpdatingMessageReaction = ref(false)
  const canUpdateMessageReaction = computed(() => !isUpdatingMessageReaction.value)

  const toggleMessageReaction = (glyphKey: string) => {
    if (!canUpdateMessageReaction.value) return

    const payload: EventAddReaction = {
      roomId: room.value.id,
      messageId: message.value.id,
      glyphKey
    }

    isUpdatingMessageReaction.value = true
    void emitSocketAction('add-reaction', payload, {
      onSettled: () => {
        isUpdatingMessageReaction.value = false
      }
    })
  }

  return {
    canUpdateMessageReaction,
    isUpdatingMessageReaction,
    toggleMessageReaction
  }
}
