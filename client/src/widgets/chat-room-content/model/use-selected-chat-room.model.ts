import { isString } from 'global-shared'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { isRoomFavorites, isRoomPrivate, useChatRoom } from 'src/entities/chat-room'

export const useSelectedChatRoom = () => {
  const route = useRoute()
  const { getById } = useChatRoom()

  const selectedChatRoomId = computed(() => {
    const { chatRoomId } = route.params

    return isString(chatRoomId) ? chatRoomId : ''
  })
  const selectedChatRoom = computed(() => getById(selectedChatRoomId.value))
  const isSelectedChatRoomPrivate = computed(() => isRoomPrivate(selectedChatRoom.value))
  const isSelectedChatRoomFavorites = computed(() => isRoomFavorites(selectedChatRoom.value))

  return {
    selectedChatRoomId,
    selectedChatRoom,
    isSelectedChatRoomFavorites,
    isSelectedChatRoomPrivate
  }
}
