import type { ChatRoom, EventAddReaction, Message } from 'global-shared'
import { computed, ref, type Ref } from 'vue'

import { useSocketAction } from 'src/shared/api'

export const useMessageReaction = (message: Ref<Message>, room: Ref<ChatRoom>) => {
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
