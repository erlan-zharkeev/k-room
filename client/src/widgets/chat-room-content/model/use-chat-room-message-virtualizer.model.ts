import type { INmorphScrollExpose } from '@nmorph/nmorph-ui-kit'
import { useVirtualizer, type Virtualizer } from '@tanstack/vue-virtual'
import { computed, nextTick, type ComputedRef, useTemplateRef, watch } from 'vue'

import { useMessage } from 'src/entities/message'

import { MESSAGE_VIRTUAL_ESTIMATED_HEIGHT, MESSAGE_VIRTUAL_GAP, MESSAGE_VIRTUAL_OVERSCAN } from '../config/constants'
import type { MessageVirtualListItemProps, MessageListItem } from '../config/types'

export const useChatRoomMessageVirtualizer = (
  messageList: ComputedRef<MessageListItem[]>,
  markVisibleMessagesAsRead: (virtualizer: Virtualizer<HTMLElement, HTMLElement>) => void
) => {
  const messagesScrollRef = useTemplateRef<INmorphScrollExpose>('messagesScroll')
  const { messageById } = useMessage()

  const messageVirtualizer = useVirtualizer<HTMLElement, HTMLElement>(
    computed(() => ({
      count: messageList.value.length,
      estimateSize: () => MESSAGE_VIRTUAL_ESTIMATED_HEIGHT,
      gap: MESSAGE_VIRTUAL_GAP,
      getItemKey: (index: number) => messageList.value[index]?.id ?? index,
      getScrollElement: () => messagesScrollRef.value?.scrollDOMContainer ?? null,
      onChange: markVisibleMessagesAsRead,
      overscan: MESSAGE_VIRTUAL_OVERSCAN
    }))
  )
  const messageVirtualItems = computed(() => messageVirtualizer.value.getVirtualItems())
  const messageVirtualListStyle = computed(() => {
    const firstItem = messageVirtualItems.value[0]
    const lastItem = messageVirtualItems.value[messageVirtualItems.value.length - 1]
    const bottomOffset = lastItem ? messageVirtualizer.value.getTotalSize() - lastItem.end : 0

    return {
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

  const scrollMessagesToBottom = async () => {
    await nextTick()

    if (!messageList.value.length) return

    messageVirtualizer.value.scrollToIndex(messageList.value.length - 1, { align: 'end', behavior: 'auto' })
  }

  watch(
    () => messagesScrollRef.value?.scrollDOMContainer,
    () => void nextTick(() => markVisibleMessagesAsRead(messageVirtualizer.value)),
    { immediate: true }
  )

  return {
    messageVirtualizer,
    measureMessageListItemElement,
    messageVirtualListStyle,
    messageVirtualListItems,
    scrollMessagesToBottom
  }
}
