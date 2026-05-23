import { buildAvatarId } from 'global-shared'
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

    if (user.value.id) {
      avatarIds.add(buildAvatarId(user.value.id))
    }

    contacts.value.forEach(({ id }) => {
      avatarIds.add(buildAvatarId(id))
    })

    knownUsers.value.forEach(({ id }) => {
      avatarIds.add(buildAvatarId(id))
    })

    chatRooms.value.forEach(({ avatarId }) => {
      avatarIds.add(avatarId)
    })

    avatarIds.forEach(sync)
  })
}
