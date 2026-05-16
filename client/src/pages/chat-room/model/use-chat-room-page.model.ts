import { isString } from 'lodash'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { isRoomPrivate, useChatRoom } from 'src/entities/chat-room'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useScreen } from 'src/shared/lib'

export const useChatRoomPage = () => {
  const route = useRoute()
  const router = useRouter()
  const { isPortraitTabletOrLess } = useScreen()
  const { chatRooms } = useChatRoom()

  const selectedChatRoomId = computed(() => {
    const { chatRoomId } = route.params

    return isString(chatRoomId) ? chatRoomId : ''
  })
  const selectedChatRoom = computed(() => chatRooms.value.find((room) => room.id === selectedChatRoomId.value))
  const selectedChatRoomIsPrivate = computed(() => isRoomPrivate(selectedChatRoom.value))

  const resetChatRoomSelection = () => {
    const query = isPortraitTabletOrLess.value ? { ...route.query, view: 'content-navigation' } : route.query

    router.push({ path: APP_PAGE_ROUTES.chatRooms, query })
  }

  return {
    selectedChatRoom,
    selectedChatRoomIsPrivate,
    resetChatRoomSelection
  }
}
