import { NmorphIconChatLineSquare, NmorphIconStarFilled } from '@nmorph/nmorph-ui-kit'
import { computed, ref } from 'vue'

import { CHAT_ROOM_I18N, getRoomOtherUserIds, isRoomFavorites, isRoomSupport } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'
import { useSocketAction } from 'src/shared/api'
import { useI18n, useScreen } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { ChatRoomContentView, ChatRoomHeaderEmit, ChatRoomHeaderProps } from '../config/types'
import { buildChatRoomTitle } from '../lib/build-chat-room-title'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useChatRoomHeader = (props: ChatRoomHeaderProps, emit: ChatRoomHeaderEmit) => {
  const { t } = useI18n()
  const { user } = useUser()
  const { emitSocketAction } = useSocketAction()
  const { isPortraitTabletOrLess } = useScreen()
  const { getRoomInterlocutor, getUsersByIds } = useChatRoomUserLookup()
  const isClosingSupportChat = ref(false)

  const otherUserIds = computed(() => getRoomOtherUserIds(props.room, user.value.id))
  const users = computed(() => getUsersByIds(otherUserIds.value))
  const interlocutor = computed(() => getRoomInterlocutor(props.room, user.value.id))
  const isFavoritesRoom = computed(() => isRoomFavorites(props.room))
  const isSupportRoom = computed(() => isRoomSupport(props.room))
  const membersQuantityText = computed(() =>
    t(CHAT_ROOM_CONTENT_I18N.membersQuantity, { quantity: props.room.users.length })
  )
  const avatarIcon = computed(() => {
    if (isFavoritesRoom.value) return NmorphIconStarFilled
    if (isSupportRoom.value) return NmorphIconChatLineSquare

    return undefined
  })
  const avatarIconColor = computed(() => {
    if (isFavoritesRoom.value) return 'var(--nmorph-warn-text-color)'
    if (isSupportRoom.value) return 'var(--nmorph-accent-color)'

    return undefined
  })
  const avatarIconSize = computed(() => {
    if (isFavoritesRoom.value) return '72%'
    if (isSupportRoom.value) return '72%'

    return undefined
  })
  const supportStatusText = computed(() =>
    props.room.supportStatus === 'closed' ? t(CHAT_ROOM_I18N.supportClosedStatus) : t(CHAT_ROOM_I18N.supportOpenStatus)
  )
  const canCloseSupportChat = computed(() => {
    const isOpenSupportRoom = isSupportRoom.value && props.room.supportStatus === 'open'
    const canManageSupportRoom = user.value.role === 'admin' || props.room.supportOwnerId === user.value.id

    return isOpenSupportRoom && canManageSupportRoom
  })
  const title = computed(() =>
    buildChatRoomTitle(
      props.room,
      users.value,
      props.isPrivateRoom,
      t(CHAT_ROOM_I18N.favoritesTitle),
      t(CHAT_ROOM_I18N.supportTitle)
    )
  )
  const updateChatRoomContentView = (view: string) => {
    emit('update-content-view', view as ChatRoomContentView)
  }
  const closeSupportChat = async () => {
    if (!canCloseSupportChat.value) {
      return
    }

    isClosingSupportChat.value = true

    try {
      await emitSocketAction('close-support-chat', { roomId: props.room.id })
    } finally {
      isClosingSupportChat.value = false
    }
  }

  return {
    avatarIcon,
    avatarIconColor,
    avatarIconSize,
    canCloseSupportChat,
    closeSupportChat,
    interlocutor,
    isClosingSupportChat,
    isFavoritesRoom,
    isSupportRoom,
    isPortraitTabletOrLess,
    membersQuantityText,
    supportStatusText,
    updateChatRoomContentView,
    title
  }
}
