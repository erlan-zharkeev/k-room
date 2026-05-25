import { computed, type Ref } from 'vue'

import { isRoomAdmin, isRoomGroup, isRoomPrivate } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'

import type { ChatRoomContextMenuItem } from '../config/types'

export const useChatRoomPermissions = (item: Readonly<Ref<ChatRoomContextMenuItem>>) => {
  const { user } = useUser()
  const isCurrentUserChatRoomAdmin = computed(() => isRoomAdmin(item.value, user.value.id))
  const canEditGroupChatRoom = computed(() => isRoomGroup(item.value) && isCurrentUserChatRoomAdmin.value)
  const canShowDeleteChatRoom = computed(() => isRoomPrivate(item.value) || canEditGroupChatRoom.value)
  const canShowLeaveChatRoom = computed(() => isRoomGroup(item.value))

  return {
    canEditGroupChatRoom,
    canShowDeleteChatRoom,
    canShowLeaveChatRoom,
    isCurrentUserChatRoomAdmin
  }
}
