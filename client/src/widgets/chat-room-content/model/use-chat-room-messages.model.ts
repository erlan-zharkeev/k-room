import type { Virtualizer } from '@tanstack/vue-virtual'
import { computed, toRef, watch } from 'vue'

import { useMessage } from 'src/entities/message'

import { ROOM_MESSAGES_PRELOAD_EDGE_ITEMS } from '../config/constants'
import type { ChatRoomMessagesProps } from '../config/types'

import { useChatRoomMessageList } from './use-chat-room-message-list.model'
import { useChatRoomMessageReadStatus } from './use-chat-room-message-read-status.model'
import { useChatRoomMessageScroll } from './use-chat-room-message-scroll.model'
import { useChatRoomMessageVirtualizer } from './use-chat-room-message-virtualizer.model'
import { useLoadRoomMessages } from './use-load-room-messages.model'

export const useChatRoomMessages = (props: ChatRoomMessagesProps) => {
  const room = toRef(props, 'room')
  const { messageById } = useMessage()
  const {
    loadedMessageRanges,
    isLoading,
    hasLoadedMessages,
    findLoadedRangeByMessageIndex,
    loadLatestMessages,
    loadMessagesAfterRange,
    loadMessagesAround,
    loadMessagesBeforeRange,
    reconcileLoadedMessageRanges
  } = useLoadRoomMessages(room)

  const { displayedLastMessageId, hasMessages, messageList } = useChatRoomMessageList(room, loadedMessageRanges)

  const { clearPendingReadMessageIds, markVisibleMessagesAsRead } = useChatRoomMessageReadStatus(room, messageList)
  let preserveMessagesScrollPosition = (action: () => Promise<void>) => action()

  const findVisibleMessageItem = (virtualizer: Virtualizer<HTMLElement, HTMLElement>, edge: 'start' | 'end') => {
    const virtualItems = virtualizer.getVirtualItems()
    const orderedItems = edge === 'start' ? virtualItems : [...virtualItems].reverse()
    const virtualItem = orderedItems.find(({ index }) => messageList.value[index]?.type === 'message')
    const item = virtualItem ? messageList.value[virtualItem.index] : null

    return item?.type === 'message' ? item : null
  }

  const preloadMessagesBefore = (messageId: string) => {
    const messageIndex = room.value.messages.indexOf(messageId)

    if (messageIndex === -1) return

    const range = findLoadedRangeByMessageIndex(room.value.id, messageIndex)

    if (!range) return
    if (range.startIndex <= 0) return

    const distanceFromRangeStart = messageIndex - range.startIndex

    if (distanceFromRangeStart > ROOM_MESSAGES_PRELOAD_EDGE_ITEMS) return

    void preserveMessagesScrollPosition(() => loadMessagesBeforeRange(room.value, range))
  }

  const preloadMessagesAfter = (messageId: string) => {
    const messageIndex = room.value.messages.indexOf(messageId)

    if (messageIndex === -1) return

    const range = findLoadedRangeByMessageIndex(room.value.id, messageIndex)

    if (!range) return
    if (range.endIndex >= room.value.messages.length - 1) return

    const distanceFromRangeEnd = range.endIndex - messageIndex

    if (distanceFromRangeEnd > ROOM_MESSAGES_PRELOAD_EDGE_ITEMS) return

    void loadMessagesAfterRange(room.value, range)
  }

  const preloadAdjacentMessages = (virtualizer: Virtualizer<HTMLElement, HTMLElement>) => {
    const firstVisibleMessage = findVisibleMessageItem(virtualizer, 'start')
    const lastVisibleMessage = findVisibleMessageItem(virtualizer, 'end')

    if (firstVisibleMessage) {
      preloadMessagesBefore(firstVisibleMessage.messageId)
    }

    if (lastVisibleMessage) {
      preloadMessagesAfter(lastVisibleMessage.messageId)
    }
  }

  const handleMessageVirtualizerChange = (virtualizer: Virtualizer<HTMLElement, HTMLElement>) => {
    markVisibleMessagesAsRead(virtualizer)
    preloadAdjacentMessages(virtualizer)
  }

  const messageVirtualizerApi = useChatRoomMessageVirtualizer(messageList, handleMessageVirtualizerChange)
  const {
    messageVirtualizer,
    measureMessageListItemElement,
    messageVirtualListStyle,
    messageVirtualListItems,
    scrollMessagesToBottom,
    scrollToMessage
  } = messageVirtualizerApi
  preserveMessagesScrollPosition = messageVirtualizerApi.preserveMessagesScrollPosition
  const { saveCurrentMessagesScrollState, saveMessagesScrollState, scrollMessagesToInitialPosition } =
    useChatRoomMessageScroll(room, messageVirtualizer, scrollMessagesToBottom)

  const messageStatusKeys = computed(() =>
    room.value.messages.map((messageId) => {
      const message = messageById.value.get(messageId)

      return message ? `${message.id}:${message.status}` : messageId
    })
  )
  const messageItemsQuantity = computed(() => messageList.value.filter((item) => item.type === 'message').length)

  const loadAndScrollToMessage = async (messageId: string) => {
    const messageIndex = room.value.messages.indexOf(messageId)

    if (messageIndex === -1) return

    const range = findLoadedRangeByMessageIndex(room.value.id, messageIndex)

    if (!range) {
      await loadMessagesAround(messageId)
    }

    await scrollToMessage(messageId)
  }

  watch(
    () => room.value.id,
    async (roomId, previousRoomId) => {
      if (previousRoomId) {
        saveCurrentMessagesScrollState(previousRoomId)
      }

      clearPendingReadMessageIds()

      try {
        await loadLatestMessages()
      } finally {
        if (room.value.id === roomId) {
          void scrollMessagesToInitialPosition(roomId)
        }
      }
    },
    { immediate: true }
  )

  watch(
    () => ({
      roomId: room.value.id,
      messageIds: [...room.value.messages]
    }),
    ({ messageIds, roomId }, previous) => {
      if (!previous || previous.roomId !== roomId) return

      reconcileLoadedMessageRanges(roomId, previous.messageIds, messageIds)
    }
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
    hasLoadedMessages,
    hasMessages,
    isLoading,
    measureMessageListItemElement,
    messageVirtualListStyle,
    messageVirtualListItems,
    loadAndScrollToMessage,
    saveMessagesScrollState
  }
}
