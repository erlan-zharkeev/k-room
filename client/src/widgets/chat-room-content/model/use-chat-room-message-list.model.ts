import { computed, type ComputedRef, type Ref } from 'vue'

import { getRoomDisplayedLastMessageId } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useLocalizedDateTime } from 'src/entities/setting'
import type { ChatRoomRecord } from 'src/shared/lib'

import type { MessageLoadedRange } from '../config/types'
import { buildMessageList } from '../lib/build-message-list'

export const useChatRoomMessageList = (
  room: Ref<ChatRoomRecord>,
  loadedMessageRanges: ComputedRef<MessageLoadedRange[]>
) => {
  const { messageById } = useMessage()
  const { formatDate } = useLocalizedDateTime()

  const displayedLastMessageId = computed(() => getRoomDisplayedLastMessageId(room.value))
  const hasMessages = computed(() => room.value.messages.length > 0)
  const messageList = computed(() =>
    buildMessageList({
      roomId: room.value.id,
      messageIds: room.value.messages,
      loadedMessageRanges: loadedMessageRanges.value,
      messageById: messageById.value,
      formatDate
    })
  )

  return {
    displayedLastMessageId,
    hasMessages,
    messageList
  }
}
