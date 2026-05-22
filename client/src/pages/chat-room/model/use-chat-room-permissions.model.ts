import { computed, type Ref } from 'vue'

import { isRoomGroup } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'

import type { ChatRoomNavigationItem } from '../config/types'

export const useChatRoomPermissions = (item: Ref<ChatRoomNavigationItem>) => {
  const { user } = useUser()
  const isGroupChat = computed(() => isRoomGroup(item.value))
  const isCurrentUserChatRoomAdmin = computed(() => item.value.adminId === user.value.id)
  const canShowDeleteChatRoom = computed(() => isGroupChat.value && isCurrentUserChatRoomAdmin.value)

  return {
    canShowDeleteChatRoom,
    canShowLeaveChatRoom: isGroupChat,
    isCurrentUserChatRoomAdmin
  }
}
