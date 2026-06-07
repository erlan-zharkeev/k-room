import type { Virtualizer } from '@tanstack/vue-virtual'
import { computed, toRef, watch } from 'vue'

import { useMessage } from 'src/entities/message'
import { useSocketAvailability } from 'src/shared/api'

import { ROOM_MESSAGES_PRELOAD_EDGE_ITEMS } from '../config/constants'
import type { ChatRoomMessagesProps, ChatRoomMessagesTargetMessageScrolled } from '../config/types'

import { useChatRoomMessageList } from './use-chat-room-message-list.model'
import { useChatRoomMessageNavigation } from './use-chat-room-message-navigation.model'
import { useChatRoomMessageReadStatus } from './use-chat-room-message-read-status.model'
import { useChatRoomMessageScrollManager } from './use-chat-room-message-scroll-manager.model'
import { useChatRoomMessageVirtualizer } from './use-chat-room-message-virtualizer.model'
import { useLoadRoomMessages } from './use-load-room-messages.model'

export const useChatRoomMessages = (
  props: ChatRoomMessagesProps,
  onTargetMessageScrolled: ChatRoomMessagesTargetMessageScrolled
) => {
  const room = toRef(props, 'room')
  const targetMessageId = toRef(props, 'targetMessageId')
  const { messageById } = useMessage()
  const { isSocketOnlineActionAvailable } = useSocketAvailability()
  const {
    loadedMessageRanges,
    isLoading,
    hasLoadedMessages,
    findLoadedRangeByMessageIndex,
    loadLatestMessages,
    loadMessagesAfterRange,
    loadMessagesAround,
    loadMessagesBeforeRange,
    reconcileLoadedMessageRanges,
    restoreCachedLoadedMessageRanges
  } = useLoadRoomMessages(room)

  const { displayedLastMessageId, hasMessages, messageList } = useChatRoomMessageList(room, loadedMessageRanges)

  const { clearPendingReadMessageIds, markVisibleMessagesAsRead } = useChatRoomMessageReadStatus(room, messageList)
  const hasCachedRoomMessages = computed(() => room.value.messages.some((messageId) => messageById.value.has(messageId)))
  const showInitialMessagesLoading = computed(() => hasMessages.value && !hasCachedRoomMessages.value)
  const messageItemsQuantity = computed(() => messageList.value.filter((item) => item.type === 'message').length)
  const {
    getSavedMessagesScrollAnchorMessageId,
    getMessagesScrollElement,
    runInitialMessagesScroll,
    saveMessagesScrollState,
    scrollMessagesToBottom,
    setMessageVirtualizer,
    showBackToBottomButton,
    updateBackToBottomButtonVisibility
  } = useChatRoomMessageScrollManager(room, displayedLastMessageId, messageList, messageItemsQuantity)
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
    updateBackToBottomButtonVisibility()
    markVisibleMessagesAsRead(virtualizer)
    preloadAdjacentMessages(virtualizer)
  }

  const messageVirtualizerApi = useChatRoomMessageVirtualizer(
    messageList,
    handleMessageVirtualizerChange,
    getMessagesScrollElement
  )
  const {
    messageVirtualizer,
    measureMessageListItemElement,
    messageVirtualListStyle,
    messageVirtualListItems,
    scrollToMessage
  } = messageVirtualizerApi
  preserveMessagesScrollPosition = messageVirtualizerApi.preserveMessagesScrollPosition
  setMessageVirtualizer(messageVirtualizer)
  const { navigateToCurrentTargetMessage, navigateToTargetMessage, resumeTargetNavigation, suspendTargetNavigation } =
    useChatRoomMessageNavigation({
      room,
      targetMessageId,
      findLoadedRangeByMessageIndex,
      loadMessagesAround,
      scrollToMessage,
      onTargetMessageScrolled
    })

  const messageStatusKeys = computed(() =>
    room.value.messages.map((messageId) => {
      const message = messageById.value.get(messageId)

      return message ? `${message.id}:${message.status}` : messageId
    })
  )

  const loadInitialMessages = async (roomId: string, previousRoomId: string | undefined) => {
    restoreCachedLoadedMessageRanges(room.value)
    clearPendingReadMessageIds()
    suspendTargetNavigation()

    try {
      await runInitialMessagesScroll(roomId, previousRoomId, async () => {
        const anchorMessageId = getSavedMessagesScrollAnchorMessageId(roomId)

        if (anchorMessageId) {
          await loadMessagesAround(anchorMessageId)
          return
        }

        await loadLatestMessages()
      })
    } finally {
      const isSameRoom = room.value.id === roomId

      if (isSameRoom) {
        resumeTargetNavigation()
        await navigateToCurrentTargetMessage()
      }
    }
  }

  watch(
    () => room.value.id,
    async (roomId, previousRoomId) => {
      await loadInitialMessages(roomId, previousRoomId)
    },
    { immediate: true }
  )

  watch(isSocketOnlineActionAvailable, async (isOnline) => {
    const hasRoomMessages = room.value.messages.length > 0
    const shouldLoadMessages = isOnline && hasRoomMessages && !isLoading.value

    if (!shouldLoadMessages) return

    if (hasLoadedMessages.value && !targetMessageId.value) {
      await loadLatestMessages()
      return
    }

    await loadInitialMessages(room.value.id, undefined)
  })

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
    () => ({
      messageId: targetMessageId.value,
      roomId: room.value.id
    }),
    ({ messageId }) => {
      if (!messageId) return

      void navigateToTargetMessage(messageId)
    },
    { immediate: true }
  )

  return {
    hasMessages,
    isLoading,
    measureMessageListItemElement,
    messageVirtualListStyle,
    messageVirtualListItems,
    saveMessagesScrollState,
    scrollMessagesToBottom,
    showInitialMessagesLoading,
    showBackToBottomButton
  }
}
