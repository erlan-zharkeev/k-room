import { watchEffect } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useSyncMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'

export const useSyncAvatars = () => {
  const { chatRooms } = useChatRoom()
  const { contacts } = useContact()
  const { knownUsers } = useKnownUser()
  const { sync } = useSyncMedia()
  const { user } = useUser()

  watchEffect(() => {
    const avatarIds = new Set<string>()

    if (user.value.avatarId) {
      avatarIds.add(user.value.avatarId)
    }

    contacts.value.forEach(({ avatarId }) => {
      if (!avatarId) return

      avatarIds.add(avatarId)
    })

    knownUsers.value.forEach(({ avatarId }) => {
      if (!avatarId) return

      avatarIds.add(avatarId)
    })

    chatRooms.value.forEach(({ avatarId }) => {
      if (!avatarId) return

      avatarIds.add(avatarId)
    })

    avatarIds.forEach(sync)
  })
}
