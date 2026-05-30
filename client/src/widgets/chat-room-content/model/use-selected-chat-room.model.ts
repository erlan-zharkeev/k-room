import { isString } from 'global-shared'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { isRoomPrivate, useChatRoom } from 'src/entities/chat-room'

export const useSelectedChatRoom = () => {
  const route = useRoute()
  const { getById } = useChatRoom()

  const selectedChatRoomId = computed(() => {
    const { chatRoomId } = route.params

    return isString(chatRoomId) ? chatRoomId : ''
  })
  const selectedChatRoom = computed(() => getById(selectedChatRoomId.value))
  const isSelectedChatRoomPrivate = computed(() => isRoomPrivate(selectedChatRoom.value))

  return {
    selectedChatRoomId,
    selectedChatRoom,
    isSelectedChatRoomPrivate
  }
}
