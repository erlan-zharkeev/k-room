import type { ChatRoom } from 'global-shared'
import { computed, type Ref } from 'vue'

import { getRoomOtherUserIds } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'
import type { ChatRoomContextMenuOption } from 'src/features/chat-room-context-menu'
import { RoomCallAudioContextMenuItem } from 'src/features/room-call-session'
import { useI18n, useScreen } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import { buildChatRoomTitle } from '../lib/build-chat-room-title'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useChatRoomHeader = (room: Ref<ChatRoom>, isPrivateRoom: boolean) => {
  const { t } = useI18n()
  const { user } = useUser()
  const { isPortraitTabletOrLess } = useScreen()
  const { getRoomInterlocutor, getUsersByIds } = useChatRoomUserLookup()

  const otherUserIds = computed(() => getRoomOtherUserIds(room.value, user.value.id))
  const users = computed(() => getUsersByIds(otherUserIds.value))
  const interlocutor = computed(() => getRoomInterlocutor(room.value, user.value.id))
  const membersQuantityText = computed(() => t(CHAT_ROOM_CONTENT_I18N.membersQuantity)(room.value.users.length))
  const title = computed(() => buildChatRoomTitle(room.value, users.value, isPrivateRoom))
  const contextMenuActionOptions = computed<ChatRoomContextMenuOption[]>(() => [
    {
      value: 'audio-call',
      component: RoomCallAudioContextMenuItem,
      componentProps: {
        roomId: room.value.id
      },
      closeOnClick: false
    }
  ])

  return {
    interlocutor,
    contextMenuActionOptions,
    isPortraitTabletOrLess,
    membersQuantityText,
    title
  }
}
