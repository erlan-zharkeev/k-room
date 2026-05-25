import { computed, nextTick, toRef, watch } from 'vue'

import { useMessage } from 'src/entities/message'

import type { ChatRoomMessagesProps } from '../config/types'

import { useChatRoomMessageList } from './use-chat-room-message-list.model'
import { useChatRoomMessageReadStatus } from './use-chat-room-message-read-status.model'
import { useChatRoomMessageVirtualizer } from './use-chat-room-message-virtualizer.model'
import { useLoadRoomMessages } from './use-load-room-messages.model'

export const useChatRoomMessages = (props: ChatRoomMessagesProps) => {
  const room = toRef(props, 'room')
  const { messageById } = useMessage()
  const { hasMoreMessages: hasMoreLoadedMessages, isLoading, loadMessages } = useLoadRoomMessages(room)

  const { displayedLastMessageId, hasMessages, messageList } = useChatRoomMessageList(room, hasMoreLoadedMessages)

  const { clearPendingReadMessageIds, markVisibleMessagesAsRead } = useChatRoomMessageReadStatus(room, messageList)

  const {
    messagesScrollRef,
    messageVirtualizer,
    measureMessageListItemElement,
    messageVirtualListStyle,
    messageVirtualListItems,
    scrollMessagesToBottom
  } = useChatRoomMessageVirtualizer(messageList, markVisibleMessagesAsRead)

  const messageStatusKeys = computed(() =>
    room.value.messages.map((messageId) => {
      const message = messageById.value.get(messageId)

      return message ? `${message.id}:${message.status}` : messageId
    })
  )
  const messageItemsQuantity = computed(() => messageList.value.filter((item) => item.type === 'message').length)

  watch(
    () => room.value.id,
    () => {
      clearPendingReadMessageIds()
      loadMessages()
      void scrollMessagesToBottom()
    },
    { immediate: true }
  )

  watch(messageStatusKeys, () => markVisibleMessagesAsRead(messageVirtualizer.value), { immediate: true })

  watch(
    messageItemsQuantity,
    (length, previousLength) => {
      if (length && !previousLength) {
        void scrollMessagesToBottom()
      }
    },
    { immediate: true }
  )

  watch(
    () => displayedLastMessageId.value,
    () => void scrollMessagesToBottom(),
    { immediate: true }
  )

  watch(
    () => messagesScrollRef.value?.scrollDOMContainer,
    () => void nextTick(() => markVisibleMessagesAsRead(messageVirtualizer.value)),
    { immediate: true }
  )

  return {
    hasMessages,
    isLoading,
    hasMoreMessages: hasMoreLoadedMessages,
    measureMessageListItemElement,
    messageVirtualListStyle,
    messageVirtualListItems,
    loadMessages
  }
}
