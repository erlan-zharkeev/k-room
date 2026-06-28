import type { ChatRoom } from 'global-shared'
import { computed, type ComputedRef, type Ref } from 'vue'

import { getRoomDisplayedLastMessageId } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useLocalizedDateTime } from 'src/entities/setting'

import type { MessageListItem, MessageLoadedRange } from '../config/types'
import { buildMessageList } from '../lib/build-message-list'
import { resolveStableMessageList } from '../lib/resolve-stable-message-list'

export const useChatRoomMessageList = (room: Ref<ChatRoom>, loadedMessageRanges: ComputedRef<MessageLoadedRange[]>) => {
  const { messageById } = useMessage()
  const { formatDate } = useLocalizedDateTime()

  const displayedLastMessageId = computed(() => getRoomDisplayedLastMessageId(room.value))
  const hasMessages = computed(() => room.value.messages.length > 0)
  const messageList = computed<MessageListItem[]>((previousMessageList) => {
    const nextMessageList = buildMessageList({
      roomId: room.value.id,
      messageIds: room.value.messages,
      loadedMessageRanges: loadedMessageRanges.value,
      messageById: messageById.value,
      formatDate
    })

    const stableMessageList = resolveStableMessageList(nextMessageList, previousMessageList)

    return stableMessageList
  })

  return {
    displayedLastMessageId,
    hasMessages,
    messageList
  }
}
