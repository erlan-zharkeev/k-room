import { watchEffect } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useSyncMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'
import { getAvatarId } from 'src/shared/lib'

export const useSyncAvatars = () => {
  const { chatRooms } = useChatRoom()
  const { contacts } = useContact()
  const { sync } = useSyncMedia()
  const { user } = useUser()

  watchEffect(() => {
    const avatarIds = new Set<string>()

    if (user.value.id) {
      avatarIds.add(getAvatarId(user.value.id))
    }

    contacts.value.forEach(({ id }) => {
      avatarIds.add(getAvatarId(id))
    })

    chatRooms.value.forEach(({ avatarId }) => {
      avatarIds.add(avatarId)
    })

    avatarIds.forEach(sync)
  })
}
