import { computed, type Ref } from 'vue'

import { isRoomPrivate } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import type { FChatRoomType } from 'src/shared/lib'

export const useChatRoomHeader = (room: Ref<FChatRoomType | undefined>) => {
  const { getByIds } = useContact()

  const isPrivateRoom = computed(() => Boolean(room.value && isRoomPrivate(room.value)))
  const contacts = computed(() => (room.value ? getByIds(room.value.users) : []))
  const privateContact = computed(() => (isPrivateRoom.value ? contacts.value[0] : undefined))
  const title = computed(() => room.value?.chatName || privateContact.value?.nickname || '')
  const avatarShape = computed<'circle' | 'square'>(() => (isPrivateRoom.value ? 'circle' : 'square'))
  const typingContactNames = computed(() =>
    contacts.value.filter(({ isTyping }) => isTyping).map(({ nickname }) => nickname)
  )

  return {
    title,
    avatarShape,
    typingContactNames
  }
}
