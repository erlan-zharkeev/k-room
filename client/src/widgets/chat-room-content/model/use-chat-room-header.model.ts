import { computed, type Ref } from 'vue'

import { getRoomOtherUserIds } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'
import { type ChatRoomRecord, useI18n, useScreen } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import { buildChatRoomTitle } from '../lib/build-chat-room-title'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useChatRoomHeader = (room: Ref<ChatRoomRecord>, isPrivateRoom: boolean) => {
  const { t } = useI18n()
  const { user } = useUser()
  const { isPortraitTabletOrLess } = useScreen()
  const { getRoomInterlocutor, getUsersByIds } = useChatRoomUserLookup()

  const otherUserIds = computed(() => getRoomOtherUserIds(room.value, user.value.id))
  const users = computed(() => getUsersByIds(otherUserIds.value))
  const interlocutor = computed(() => getRoomInterlocutor(room.value, user.value.id))
  const membersQuantityText = computed(() => t(CHAT_ROOM_CONTENT_I18N.membersQuantity)(room.value.users.length))
  const title = computed(() => buildChatRoomTitle(room.value, users.value, isPrivateRoom))

  return {
    interlocutor,
    isPortraitTabletOrLess,
    membersQuantityText,
    title
  }
}
