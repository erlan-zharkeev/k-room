import type { EventUpdatePinnedMessage } from 'global-shared'
import { computed, ref, toRef } from 'vue'

import { useMessage } from 'src/entities/message'
import { useSocketAction } from 'src/shared/api'

import type { ChatRoomPinnedMessageProps } from '../config/types'

export const useChatRoomPinnedMessage = (props: ChatRoomPinnedMessageProps) => {
  const room = toRef(props, 'room')
  const { messageById } = useMessage()
  const { emitSocketAction } = useSocketAction()
  const isUpdatingPinnedMessage = ref(false)
  const pinnedMessage = computed(() => {
    const { pinnedMessageId } = room.value

    return pinnedMessageId ? messageById.value.get(pinnedMessageId) : undefined
  })
  const canUpdatePinnedMessage = computed(() => Boolean(pinnedMessage.value) && !isUpdatingPinnedMessage.value)
  const pinnedMessageText = computed(() => {
    if (!pinnedMessage.value) return ''

    return pinnedMessage.value.body || pinnedMessage.value.images?.[0]?.name || ''
  })

  const unpinPinnedMessage = () => {
    if (!pinnedMessage.value || !canUpdatePinnedMessage.value) return

    const payload: EventUpdatePinnedMessage = {
      roomId: room.value.id,
      messageId: pinnedMessage.value.id,
      isPinned: false
    }

    isUpdatingPinnedMessage.value = true
    void emitSocketAction<EventUpdatePinnedMessage>('update-pinned-message', payload, {
      onSettled: () => {
        isUpdatingPinnedMessage.value = false
      }
    })
  }

  return {
    canUpdatePinnedMessage,
    isUpdatingPinnedMessage,
    pinnedMessage,
    pinnedMessageText,
    unpinPinnedMessage
  }
}
