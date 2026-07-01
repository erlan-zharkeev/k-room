import { getAppChatRoomPath } from 'global-shared'
import { computed, type ComputedRef, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'

import type { ChatRoomMessageSelection } from '../config/types'

export const useChatRoomMessageSelection = (selectedChatRoomId: ComputedRef<string>) => {
  const route = useRoute()
  const router = useRouter()
  const { getById } = useChatRoom()
  const selectedMessageSelection = ref<ChatRoomMessageSelection | null>(null)

  const selectedMessageId = computed(() => {
    const selection = selectedMessageSelection.value

    if (!selection || selection.roomId !== selectedChatRoomId.value) return ''

    return selection.messageId
  })

  const selectChatRoomMessage = async ({ roomId, messageId }: ChatRoomMessageSelection) => {
    const room = getById(roomId)
    const isCurrentRoom = roomId === selectedChatRoomId.value

    if (!room || !room.messages.includes(messageId)) return

    selectedMessageSelection.value = { roomId, messageId }

    if (!isCurrentRoom) {
      await router.push({
        path: getAppChatRoomPath(roomId),
        query: route.query
      })
    }
  }

  const selectCurrentChatRoomMessage = (messageId: string) => {
    const roomId = selectedChatRoomId.value

    if (!roomId) return

    void selectChatRoomMessage({ roomId, messageId })
  }

  const clearSelectedMessage = () => {
    selectedMessageSelection.value = null
  }

  return {
    clearSelectedMessage,
    selectChatRoomMessage,
    selectCurrentChatRoomMessage,
    selectedMessageId
  }
}
