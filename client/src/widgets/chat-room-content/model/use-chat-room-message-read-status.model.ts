import type { VirtualItem, Virtualizer } from '@tanstack/vue-virtual'
import {
  MESSAGE_STATUS_VALUE,
  isMessageReadStatus,
  isMessageSendingStatus,
  type EventChangeMessageStatus
} from 'global-shared'
import { onBeforeUnmount, type ComputedRef, type Ref } from 'vue'

import { useMessage } from 'src/entities/message'
import { socket } from 'src/shared/api'
import type { ChatRoomRecord } from 'src/shared/lib'

import { MESSAGE_READ_VISIBILITY_RATIO } from '../config/constants'
import type { MessageListItem } from '../config/types'

export const useChatRoomMessageReadStatus = (
  room: Ref<ChatRoomRecord>,
  messageList: ComputedRef<MessageListItem[]>
) => {
  const pendingReadMessageIds = new Set<string>()
  const { messageById } = useMessage()

  const markMessageAsRead = (messageId: string) => {
    const message = messageById.value.get(messageId)

    if (!message) return

    if (
      message.isSelf ||
      isMessageReadStatus(message.status) ||
      isMessageSendingStatus(message.status) ||
      pendingReadMessageIds.has(message.id)
    ) {
      return
    }

    const payload: EventChangeMessageStatus = {
      roomId: room.value.id,
      messageId: message.id,
      status: MESSAGE_STATUS_VALUE.READ
    }

    pendingReadMessageIds.add(message.id)
    socket.emit('change-message-status', payload)
  }

  const isVirtualItemVisible = (virtualItem: VirtualItem, scrollOffset: number, viewportHeight: number) => {
    const visibleHeight =
      Math.min(virtualItem.end, scrollOffset + viewportHeight) - Math.max(virtualItem.start, scrollOffset)

    if (visibleHeight <= 0 || virtualItem.size <= 0 || viewportHeight <= 0) return false

    return visibleHeight / Math.min(virtualItem.size, viewportHeight) >= MESSAGE_READ_VISIBILITY_RATIO
  }

  const markVisibleMessagesAsRead = (virtualizer: Virtualizer<HTMLElement, HTMLElement>) => {
    const scrollOffset = virtualizer.scrollOffset ?? 0
    const viewportHeight = virtualizer.scrollRect?.height ?? 0

    if (viewportHeight <= 0) return

    virtualizer.getVirtualItems().forEach((virtualItem) => {
      const item = messageList.value[virtualItem.index]

      if (item?.type === 'message' && isVirtualItemVisible(virtualItem, scrollOffset, viewportHeight)) {
        markMessageAsRead(item.messageId)
      }
    })
  }

  const clearPendingReadMessageIds = () => {
    pendingReadMessageIds.clear()
  }

  onBeforeUnmount(clearPendingReadMessageIds)

  return {
    clearPendingReadMessageIds,
    markVisibleMessagesAsRead
  }
}
