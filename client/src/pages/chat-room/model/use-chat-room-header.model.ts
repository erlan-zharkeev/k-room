import { computed, type Ref } from 'vue'

import type { ChatRoomRecord } from 'src/shared/lib'

import { buildChatRoomTitle } from '../lib/build-chat-room-title'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useChatRoomHeader = (room: Ref<ChatRoomRecord>, isPrivateRoom: boolean) => {
  const { getUsersByIds } = useChatRoomUserLookup()

  const users = computed(() => getUsersByIds(room.value.users))
  const title = computed(() => buildChatRoomTitle(room.value, users.value, isPrivateRoom))
  const typingContactNames = computed(() =>
    users.value.filter(({ isTyping }) => isTyping).map(({ nickname }) => nickname)
  )

  return {
    title,
    typingContactNames
  }
}
