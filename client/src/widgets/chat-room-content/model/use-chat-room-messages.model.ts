import { computed, toRef, watch } from 'vue'

import { useMessage } from 'src/entities/message'

import type { ChatRoomMessagesProps } from '../config/types'

import { useChatRoomMessageList } from './use-chat-room-message-list.model'
import { useChatRoomMessageReadStatus } from './use-chat-room-message-read-status.model'
import { useChatRoomMessageScroll } from './use-chat-room-message-scroll.model'
import { useChatRoomMessageVirtualizer } from './use-chat-room-message-virtualizer.model'
import { useLoadRoomMessages } from './use-load-room-messages.model'

export const useChatRoomMessages = (props: ChatRoomMessagesProps) => {
  const room = toRef(props, 'room')
  const { messageById } = useMessage()
  const { hasMoreMessages: hasMoreLoadedMessages, isLoading, loadMessages } = useLoadRoomMessages(room)

  const { displayedLastMessageId, hasMessages, messageList } = useChatRoomMessageList(room, hasMoreLoadedMessages)

  const { clearPendingReadMessageIds, markVisibleMessagesAsRead } = useChatRoomMessageReadStatus(room, messageList)

  const {
    messageVirtualizer,
    measureMessageListItemElement,
    messageVirtualListStyle,
    messageVirtualListItems,
    scrollMessagesToBottom
  } = useChatRoomMessageVirtualizer(messageList, markVisibleMessagesAsRead)
  const { saveCurrentMessagesScrollState, saveMessagesScrollState, scrollMessagesToInitialPosition } =
    useChatRoomMessageScroll(room, messageVirtualizer, scrollMessagesToBottom)

  const messageStatusKeys = computed(() =>
    room.value.messages.map((messageId) => {
      const message = messageById.value.get(messageId)

      return message ? `${message.id}:${message.status}` : messageId
    })
  )
  const messageItemsQuantity = computed(() => messageList.value.filter((item) => item.type === 'message').length)

  watch(
    () => room.value.id,
    async (roomId, previousRoomId) => {
      if (previousRoomId) {
        saveCurrentMessagesScrollState(previousRoomId)
      }

      clearPendingReadMessageIds()

      try {
        await loadMessages()
      } finally {
        if (room.value.id === roomId) {
          void scrollMessagesToInitialPosition(roomId)
        }
      }
    },
    { immediate: true }
  )

  watch(messageStatusKeys, () => markVisibleMessagesAsRead(messageVirtualizer.value), { immediate: true })

  watch(
    messageItemsQuantity,
    (length, previousLength) => {
      if (length && !previousLength) {
        void scrollMessagesToInitialPosition(room.value.id)
      }
    },
    { immediate: true }
  )

  watch(
    () => ({
      displayedLastMessageId: displayedLastMessageId.value,
      roomId: room.value.id
    }),
    ({ displayedLastMessageId, roomId }, previous) => {
      const isSameRoom = previous?.roomId === roomId
      const hasDisplayedLastMessageChanged = previous?.displayedLastMessageId !== displayedLastMessageId

      if (isSameRoom && hasDisplayedLastMessageChanged) {
        void scrollMessagesToBottom()
      }
    },
    { immediate: true }
  )

  return {
    hasMessages,
    isLoading,
    hasMoreMessages: hasMoreLoadedMessages,
    measureMessageListItemElement,
    messageVirtualListStyle,
    messageVirtualListItems,
    loadMessages,
    saveMessagesScrollState
  }
}
