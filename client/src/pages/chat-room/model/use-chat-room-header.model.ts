import { computed, type Ref } from 'vue'

import { getRoomOtherUserIds } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'
import type { ChatRoomRecord } from 'src/shared/lib'

import { buildChatRoomTitle } from '../lib/build-chat-room-title'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useChatRoomHeader = (room: Ref<ChatRoomRecord>, isPrivateRoom: boolean) => {
  const { user } = useUser()
  const { getUsersByIds } = useChatRoomUserLookup()

  const otherUserIds = computed(() => getRoomOtherUserIds(room.value, user.value.id))
  const users = computed(() => getUsersByIds(otherUserIds.value))
  const title = computed(() => buildChatRoomTitle(room.value, users.value, isPrivateRoom))
  const typingContactNames = computed(() =>
    users.value.filter(({ isTyping }) => isTyping).map(({ nickname }) => nickname)
  )

  return {
    title,
    typingContactNames
  }
}
