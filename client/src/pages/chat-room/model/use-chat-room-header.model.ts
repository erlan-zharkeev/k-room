import { computed, type Ref } from 'vue'

import { useContact } from 'src/entities/contact'
import type { FChatRoomType } from 'src/shared/lib'

import { buildChatRoomTitle } from '../lib/build-chat-room-title'

export const useChatRoomHeader = (room: Ref<FChatRoomType>, isPrivateRoom: boolean) => {
  const { getByIds } = useContact()

  const contacts = computed(() => getByIds(room.value.users))
  const title = computed(() => buildChatRoomTitle(room.value, contacts.value, isPrivateRoom))
  const typingContactNames = computed(() =>
    contacts.value.filter(({ isTyping }) => isTyping).map(({ nickname }) => nickname)
  )

  return {
    title,
    typingContactNames
  }
}
