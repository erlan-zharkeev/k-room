import { computed, type Ref } from 'vue'

import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import type { ChatRoomRecordType } from 'src/shared/lib'

import { buildChatRoomTitle } from '../lib/build-chat-room-title'

export const useChatRoomHeader = (room: Ref<ChatRoomRecordType>, isPrivateRoom: boolean) => {
  const { getByIds: getContactsByIds } = useContact()
  const { getByIds: getKnownUsersByIds } = useKnownUser()

  const users = computed(() => {
    const contactById = new Map(getContactsByIds(room.value.users).map((userData) => [userData.id, userData]))
    const knownUserById = new Map(getKnownUsersByIds(room.value.users).map((userData) => [userData.id, userData]))

    return room.value.users.flatMap((id) => contactById.get(id) ?? knownUserById.get(id) ?? [])
  })
  const title = computed(() => buildChatRoomTitle(room.value, users.value, isPrivateRoom))
  const typingContactNames = computed(() =>
    users.value.filter(({ isTyping }) => isTyping).map(({ nickname }) => nickname)
  )

  return {
    title,
    typingContactNames
  }
}
