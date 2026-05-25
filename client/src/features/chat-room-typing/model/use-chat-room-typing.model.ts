import type { EventRoomTypingStatus } from 'global-shared'
import { computed, reactive } from 'vue'

import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useI18n } from 'src/shared/lib'

import { CHAT_ROOM_TYPING_I18N } from '../config/i18n'
import type { ChatRoomTypingStatusProps } from '../config/types'

const typingUserIdsByRoomId = reactive<Record<string, string[] | undefined>>({})

const selectRoomTypingUserIds = (roomId: string) => typingUserIdsByRoomId[roomId] ?? []

export const updateRoomTypingStatus = ({ roomId, contactId, isTyping }: EventRoomTypingStatus) => {
  const currentUserIds = selectRoomTypingUserIds(roomId)

  if (isTyping) {
    if (currentUserIds.includes(contactId)) return

    typingUserIdsByRoomId[roomId] = [...currentUserIds, contactId]
    return
  }

  const nextUserIds = currentUserIds.filter((id) => id !== contactId)

  if (!nextUserIds.length) {
    delete typingUserIdsByRoomId[roomId]
    return
  }

  typingUserIdsByRoomId[roomId] = nextUserIds
}

export const useChatRoomTypingStatus = (props: ChatRoomTypingStatusProps) => {
  const { t } = useI18n()
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const typingContactNames = computed(() =>
    selectRoomTypingUserIds(props.roomId).reduce<string[]>((names, id) => {
      const user = contactById.value.get(id) ?? knownUserById.value.get(id)

      if (user) {
        names.push(user.nickname)
      }

      return names
    }, [])
  )
  const typingText = computed(() =>
    typingContactNames.value.length ? t(CHAT_ROOM_TYPING_I18N.typingStatus)(typingContactNames.value) : ''
  )

  return {
    typingText
  }
}
