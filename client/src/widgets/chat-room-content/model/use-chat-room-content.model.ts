import { isString } from 'global-shared'
import { computed, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'

import { isRoomPrivate, useChatRoom } from 'src/entities/chat-room'

import type { ChatRoomMessagesExpose } from '../config/types'

export const useChatRoomContent = () => {
  const route = useRoute()
  const { chatRooms } = useChatRoom()
  const chatRoomMessages = useTemplateRef<ChatRoomMessagesExpose>('chatRoomMessages')

  const selectedChatRoomId = computed(() => {
    const { chatRoomId } = route.params

    return isString(chatRoomId) ? chatRoomId : ''
  })
  const selectedChatRoom = computed(() => chatRooms.value.find((room) => room.id === selectedChatRoomId.value))
  const selectedChatRoomIsPrivate = computed(() => isRoomPrivate(selectedChatRoom.value))
  const selectMessage = (messageId: string) => {
    void chatRoomMessages.value?.loadAndScrollToMessage(messageId)
  }

  return {
    selectMessage,
    selectedChatRoom,
    selectedChatRoomIsPrivate
  }
}
