import { computed, type ComputedRef, type Ref } from 'vue'

import { getRoomDisplayedLastMessageId } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useLocalizedDateTime } from 'src/entities/setting'
import type { FChatRoomType } from 'src/shared/lib'

import type { MessageListItemType } from '../config/types'

export const useChatRoomMessageList = (room: Ref<FChatRoomType>, hasMoreLoadedMessages: ComputedRef<boolean>) => {
  const { messageById } = useMessage()
  const { formatDate } = useLocalizedDateTime()

  const displayedLastMessageId = computed(() => getRoomDisplayedLastMessageId(room.value))
  const hasMessages = computed(() => room.value.messages.length > 0)
  const messageList = computed<MessageListItemType[]>(() => {
    const items: MessageListItemType[] = []
    let previousLabel = ''

    if (hasMoreLoadedMessages.value) {
      items.push({
        type: 'load-older',
        id: `load-older-${room.value.id}`
      })
    }

    room.value.messages.forEach((messageId) => {
      const message = messageById.value.get(messageId)

      if (!message) return

      const label = message.createdAt ? formatDate(message.createdAt) : ''

      if (label && previousLabel !== label) {
        items.push({
          type: 'date-separator',
          id: `date-separator-${message.id}`,
          label
        })
        previousLabel = label
      }

      items.push({
        type: 'message',
        id: messageId,
        messageId
      })
    })

    return items
  })

  return {
    displayedLastMessageId,
    hasMessages,
    messageList
  }
}
