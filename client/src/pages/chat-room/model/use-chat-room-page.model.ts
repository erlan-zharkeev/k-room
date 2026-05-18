import { isString } from 'lodash'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { isRoomPrivate, useChatRoom } from 'src/entities/chat-room'

export const useChatRoomPage = () => {
  const route = useRoute()
  const { chatRooms } = useChatRoom()

  const selectedChatRoomId = computed(() => {
    const { chatRoomId } = route.params

    return isString(chatRoomId) ? chatRoomId : ''
  })
  const selectedChatRoom = computed(() => chatRooms.value.find((room) => room.id === selectedChatRoomId.value))
  const selectedChatRoomIsPrivate = computed(() => isRoomPrivate(selectedChatRoom.value))

  return {
    selectedChatRoom,
    selectedChatRoomIsPrivate
  }
}
