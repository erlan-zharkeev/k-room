import { computed } from 'vue'

import { getRoomOtherUserIds } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'
import { useI18n, useScreen } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { ChatRoomContentView, ChatRoomHeaderEmit, ChatRoomHeaderProps } from '../config/types'
import { buildChatRoomTitle } from '../lib/build-chat-room-title'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useChatRoomHeader = (props: ChatRoomHeaderProps, emit: ChatRoomHeaderEmit) => {
  const { t } = useI18n()
  const { user } = useUser()
  const { isPortraitTabletOrLess } = useScreen()
  const { getRoomInterlocutor, getUsersByIds } = useChatRoomUserLookup()

  const otherUserIds = computed(() => getRoomOtherUserIds(props.room, user.value.id))
  const users = computed(() => getUsersByIds(otherUserIds.value))
  const interlocutor = computed(() => getRoomInterlocutor(props.room, user.value.id))
  const membersQuantityText = computed(() => t(CHAT_ROOM_CONTENT_I18N.membersQuantity)(props.room.users.length))
  const title = computed(() => buildChatRoomTitle(props.room, users.value, props.isPrivateRoom))
  const updateChatRoomContentView = (view: string) => {
    emit('update-content-view', view as ChatRoomContentView)
  }

  return {
    interlocutor,
    isPortraitTabletOrLess,
    membersQuantityText,
    updateChatRoomContentView,
    title
  }
}
