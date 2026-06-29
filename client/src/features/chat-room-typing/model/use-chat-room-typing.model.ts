import { computed } from 'vue'

import { CHAT_ROOM_I18N, isRoomSupport, useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_TYPING_I18N } from '../config/i18n'
import type { ChatRoomTypingStatusProps } from '../config/types'

import { selectRoomTypingUserIds } from './chat-room-typing-status.store.model'

export const useChatRoomTypingStatus = (props: ChatRoomTypingStatusProps) => {
  const { t } = useI18n()
  const { contactById } = useContact()
  const { getById } = useChatRoom()
  const { knownUserById } = useKnownUser()
  const room = computed(() => getById(props.roomId))
  const typingContactNames = computed(() =>
    selectRoomTypingUserIds(props.roomId).reduce<string[]>((names, id) => {
      const currentRoom = room.value

      if (currentRoom && isRoomSupport(currentRoom) && id !== currentRoom.supportOwnerId) {
        const supportName = t(CHAT_ROOM_I18N.supportTitle)

        if (!names.includes(supportName)) {
          names.push(supportName)
        }

        return names
      }

      const user = contactById.value.get(id) ?? knownUserById.value.get(id)

      if (user) {
        names.push(user.nickname)
      }

      return names
    }, [])
  )
  const typingText = computed(() =>
    typingContactNames.value.length ? t(CHAT_ROOM_TYPING_I18N.typingStatus, { names: typingContactNames.value }) : ''
  )

  return {
    typingText
  }
}
