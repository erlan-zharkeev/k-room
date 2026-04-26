import { watchEffect } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useSyncMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'

export const useSyncAvatars = () => {
  const { chatRooms } = useChatRoom()
  const { contacts } = useContact()
  const { sync } = useSyncMedia()
  const { user } = useUser()

  watchEffect(() => {
    const avatarIds = new Set<string>()

    if (user.value.id) {
      avatarIds.add(`avatar.${user.value.id}`)
    }

    contacts.value.forEach(({ id }) => {
      avatarIds.add(`avatar.${id}`)
    })

    chatRooms.value.forEach(({ avatarId }) => {
      avatarIds.add(avatarId)
    })

    avatarIds.forEach(sync)
  })
}
