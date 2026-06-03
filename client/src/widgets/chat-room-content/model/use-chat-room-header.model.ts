import type { RoomCallMediaKind } from 'global-shared'
import { computed } from 'vue'

import { getRoomOtherUserIds } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'
import type { ChatRoomContextMenuOption } from 'src/features/chat-room-context-menu'
import { ROOM_CALL_MEDIA_BUTTONS_ACTION, RoomCallAudioContextMenuItem } from 'src/features/room-call-session'
import { useI18n, useScreen } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { ChatRoomHeaderEmit, ChatRoomHeaderProps } from '../config/types'
import { buildChatRoomTitle } from '../lib/build-chat-room-title'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useChatRoomHeader = (props: ChatRoomHeaderProps, emit: ChatRoomHeaderEmit) => {
  const { t } = useI18n()
  const { user } = useUser()
  const { isPortraitTabletOrLess } = useScreen()
  const { getRoomInterlocutor, getUsersByIds } = useChatRoomUserLookup()

  const isRoomCallJoinMode = computed(() => Boolean(props.joinableRoomCall))
  const otherUserIds = computed(() => getRoomOtherUserIds(props.room, user.value.id))
  const users = computed(() => getUsersByIds(otherUserIds.value))
  const interlocutor = computed(() => getRoomInterlocutor(props.room, user.value.id))
  const membersQuantityText = computed(() => t(CHAT_ROOM_CONTENT_I18N.membersQuantity)(props.room.users.length))
  const title = computed(() => buildChatRoomTitle(props.room, users.value, props.isPrivateRoom))
  const roomCallButtonsAction = computed(() =>
    isRoomCallJoinMode.value ? ROOM_CALL_MEDIA_BUTTONS_ACTION.JOIN : ROOM_CALL_MEDIA_BUTTONS_ACTION.START
  )
  const isRoomCallButtonsDisabled = computed(() =>
    isRoomCallJoinMode.value ? props.isRoomCallJoinDisabled : props.isRoomCallStartDisabled
  )
  const isRoomCallButtonsLoading = computed(() =>
    isRoomCallJoinMode.value ? props.isRoomCallJoining : props.isRoomCallStarting
  )
  const contextMenuActionOptions = computed<ChatRoomContextMenuOption[]>(() => [
    {
      value: 'audio-call',
      component: RoomCallAudioContextMenuItem,
      componentProps: {
        roomId: props.room.id
      },
      closeOnClick: false
    }
  ])
  const handleRoomCallButtonsAction = (mediaKind: RoomCallMediaKind) => {
    if (isRoomCallJoinMode.value) {
      emit('join-room-call', mediaKind)
      return
    }
    emit('start-room-call', mediaKind)
  }

  return {
    interlocutor,
    contextMenuActionOptions,
    handleRoomCallButtonsAction,
    isPortraitTabletOrLess,
    isRoomCallButtonsDisabled,
    isRoomCallButtonsLoading,
    membersQuantityText,
    roomCallButtonsAction,
    title
  }
}
