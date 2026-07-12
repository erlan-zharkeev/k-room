import { useVirtualizer, type Virtualizer } from '@tanstack/vue-virtual'
import { computed, nextTick, type ComputedRef, watch } from 'vue'

import { useMessage } from 'src/entities/message'

import {
  MESSAGE_RANGE_GAP_HEIGHT,
  MESSAGE_VIRTUAL_ESTIMATED_HEIGHT,
  MESSAGE_VIRTUAL_GAP,
  MESSAGE_VIRTUAL_OVERSCAN,
  MESSAGE_VIRTUAL_PADDING_START
} from '../config/constants'
import type { MessageVirtualListItemProps, MessageListItem } from '../config/types'

export const useChatRoomMessageVirtualizer = (
  messageList: ComputedRef<MessageListItem[]>,
  handleMessageVirtualizerChange: (virtualizer: Virtualizer<HTMLElement, HTMLElement>) => void,
  getMessagesScrollElement: () => HTMLElement | null
) => {
  const { messageById } = useMessage()

  const messageVirtualizer = useVirtualizer<HTMLElement, HTMLElement>(
    computed(() => ({
      count: messageList.value.length,
      estimateSize: () => MESSAGE_VIRTUAL_ESTIMATED_HEIGHT,
      gap: MESSAGE_VIRTUAL_GAP,
      getItemKey: (index: number) => messageList.value[index]?.id ?? index,
      getScrollElement: getMessagesScrollElement,
      onChange: handleMessageVirtualizerChange,
      overscan: MESSAGE_VIRTUAL_OVERSCAN,
      paddingStart: MESSAGE_VIRTUAL_PADDING_START
    }))
  )
  const messageVirtualItems = computed(() => messageVirtualizer.value.getVirtualItems())
  const messageVirtualListStyle = computed(() => {
    const firstItem = messageVirtualItems.value[0]
    const lastItem = messageVirtualItems.value[messageVirtualItems.value.length - 1]
    const bottomOffset = lastItem ? messageVirtualizer.value.getTotalSize() - lastItem.end : 0

    return {
      '--message-range-gap-height': `${MESSAGE_RANGE_GAP_HEIGHT}px`,
      '--message-virtual-gap': `${MESSAGE_VIRTUAL_GAP}px`,
      paddingTop: `${firstItem?.start ?? 0}px`,
      paddingBottom: `${Math.max(bottomOffset, 0)}px`
    }
  })
  const messageVirtualListItems = computed<MessageVirtualListItemProps[]>(() =>
    messageVirtualItems.value.flatMap((virtualItem) => {
      const item = messageList.value[virtualItem.index]

      if (!item) return []

      if (item.type === 'message') {
        const message = messageById.value.get(item.messageId)

        if (!message) return []

        return {
          item: {
            ...item,
            message
          },
          virtualItem
        }
      }

      return {
        item,
        virtualItem
      }
    })
  )

  const measureMessageListItemElement = (element: unknown) => {
    messageVirtualizer.value.measureElement(element instanceof HTMLElement ? element : null)
  }

  const scrollToMessage = async (messageId: string) => {
    await nextTick()

    const messageIndex = messageList.value.findIndex((item) => item.type === 'message' && item.messageId === messageId)

    if (messageIndex === -1) return

    messageVirtualizer.value.scrollToIndex(messageIndex, { align: 'center', behavior: 'auto' })
  }

  const preserveMessagesScrollPosition = async (action: () => Promise<void>) => {
    const scrollElement = getMessagesScrollElement()
    const scrollHeight = scrollElement?.scrollHeight ?? 0
    const scrollTop = scrollElement?.scrollTop ?? 0

    await action()
    await nextTick()

    if (!scrollElement) return

    const scrollHeightDelta = scrollElement.scrollHeight - scrollHeight
    const requestedScrollTop = scrollTop + scrollHeightDelta

    messageVirtualizer.value.scrollToOffset(requestedScrollTop, { behavior: 'auto' })
    await nextTick()
  }

  watch(getMessagesScrollElement, () => handleMessageVirtualizerChange(messageVirtualizer.value), {
    flush: 'post',
    immediate: true
  })

  return {
    messageVirtualizer,
    measureMessageListItemElement,
    messageVirtualListStyle,
    messageVirtualListItems,
    preserveMessagesScrollPosition,
    scrollToMessage
  }
}
