import { computed, type Ref } from 'vue'

import { isRoomAdmin, isRoomGroup, isRoomPrivate } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'

import type { ChatRoomNavigationItem } from '../config/types'

export const useChatRoomPermissions = (item: Ref<ChatRoomNavigationItem>) => {
  const { user } = useUser()
  const isCurrentUserChatRoomAdmin = computed(() => isRoomAdmin(item.value, user.value.id))
  const canDeleteGroupChatRoom = computed(() => isRoomGroup(item.value) && isCurrentUserChatRoomAdmin.value)
  const canShowDeleteChatRoom = computed(() => isRoomPrivate(item.value) || canDeleteGroupChatRoom.value)
  const canShowLeaveChatRoom = computed(() => isRoomGroup(item.value))

  return {
    canShowDeleteChatRoom,
    canShowLeaveChatRoom,
    isCurrentUserChatRoomAdmin
  }
}
