import { NmorphIconHeadset, NmorphIconStarFilled } from '@nmorph/nmorph-ui-kit'
import { type ChatRoom, type EventSendMessage, type Message } from 'global-shared'
import { v4 as uuidv4 } from 'uuid'
import { computed, onScopeDispose, type Ref, ref, toRef, watch } from 'vue'

import {
  CHAT_ROOM_I18N,
  getRoomOtherUserIds,
  isRoomFavorites,
  isRoomPrivate,
  isRoomSupport,
  useChatRoom
} from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useUser } from 'src/entities/user'
import { setClientUpdateReloadBlock, socket, useSocketAvailability, useSocketTransportErrorToast } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'
import type { AppProfilePickerItem } from 'src/shared/ui'

import type { MessageForwardDialogProps } from '../config/types'
import { buildChatRoomTitle } from '../lib/build-chat-room-title'
import { buildRepliedMessage } from '../lib/build-replied-message'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

let messageForwardClientUpdateReloadBlockerId = 0

export const useMessageForward = (props: MessageForwardDialogProps, isMessageForwardDialogOpen: Ref<boolean>) => {
  const forwardedMessage = toRef(props, 'message')
  const sourceRoomId = toRef(props, 'sourceRoomId')
  const { chatRooms, mutate } = useChatRoom()
  const { put } = useMessage()
  const { user } = useUser()
  const { isSocketOnlineActionAvailable } = useSocketAvailability()
  const { showSocketTransportErrorToast } = useSocketTransportErrorToast()
  const { t } = useI18n()
  const { getRoomInterlocutor, getUsersByIds } = useChatRoomUserLookup()
  const selectedMessageForwardRoomIds = ref<string[]>([])
  const messageForwardSearchQuery = ref('')
  const isForwardingMessage = ref(false)
  const clientUpdateReloadBlockerId = `message-forward:${(messageForwardClientUpdateReloadBlockerId += 1)}`
  const normalizedMessageForwardSearchQuery = computed(() => messageForwardSearchQuery.value.trim().toLowerCase())

  const buildMessageForwardChatRoomItem = (room: ChatRoom): AppProfilePickerItem => {
    const isPrivateRoom = isRoomPrivate(room)
    const otherUserIds = getRoomOtherUserIds(room, user.value.id)
    const users = getUsersByIds(otherUserIds)
    const interlocutor = getRoomInterlocutor(room, user.value.id)
    const isFavoritesRoom = isRoomFavorites(room)
    const isSupportRoom = isRoomSupport(room)

    return {
      id: room.id,
      avatarIcon: isFavoritesRoom ? NmorphIconStarFilled : isSupportRoom ? NmorphIconHeadset : undefined,
      avatarIconColor: isFavoritesRoom
        ? 'var(--nmorph-warn-text-color)'
        : isSupportRoom
        ? 'var(--nmorph-accent-color)'
        : undefined,
      avatarIconSize: isFavoritesRoom ? '72%' : isSupportRoom ? '72%' : undefined,
      imageId: isPrivateRoom ? interlocutor?.avatarId : room.avatarId,
      title: buildChatRoomTitle(
        room,
        users,
        isPrivateRoom,
        t(CHAT_ROOM_I18N.favoritesTitle),
        t(CHAT_ROOM_I18N.supportTitle)
      ),
      online: Boolean(isPrivateRoom && interlocutor?.online)
    }
  }

  const messageForwardChatRoomItems = computed(() => chatRooms.value.map(buildMessageForwardChatRoomItem))
  const filteredMessageForwardChatRoomItems = computed(() =>
    normalizedMessageForwardSearchQuery.value
      ? messageForwardChatRoomItems.value.filter(({ title }) =>
          title.toLowerCase().includes(normalizedMessageForwardSearchQuery.value)
        )
      : messageForwardChatRoomItems.value
  )
  const hasMessageForwardChatRooms = computed(() => Boolean(messageForwardChatRoomItems.value.length))
  const showMessageForwardSearchEmpty = computed(
    () => Boolean(normalizedMessageForwardSearchQuery.value) && filteredMessageForwardChatRoomItems.value.length === 0
  )
  const canSelectMessageForwardRoom = computed(() => {
    const hasSelectedMessageForwardRoom = Boolean(selectedMessageForwardRoomIds.value[0])

    return hasSelectedMessageForwardRoom && !isForwardingMessage.value
  })

  const resetMessageForwardDialog = () => {
    selectedMessageForwardRoomIds.value = []
    messageForwardSearchQuery.value = ''
  }

  const closeMessageForwardDialog = () => {
    isMessageForwardDialogOpen.value = false
    resetMessageForwardDialog()
  }

  const updateMessageForwardDialogOpen = (isOpen: boolean) => {
    if (isOpen) {
      isMessageForwardDialogOpen.value = true

      return
    }

    closeMessageForwardDialog()
  }

  const updateSelectedMessageForwardRoomIds = (roomIds: string[]) => {
    selectedMessageForwardRoomIds.value = roomIds.slice(-1)
  }

  const selectMessageForwardRoom = async () => {
    const roomId = selectedMessageForwardRoomIds.value[0]
    const { id: authorId, nickname: authorNickname } = user.value
    const isForwardUnavailable = !roomId || !authorId || isForwardingMessage.value

    if (isForwardUnavailable) return

    if (!isSocketOnlineActionAvailable.value) {
      showSocketTransportErrorToast()
      return
    }

    const repliedMessage = buildRepliedMessage(forwardedMessage.value, 'forward', sourceRoomId.value)
    const message: Message = {
      id: uuidv4(),
      authorId,
      authorNickname,
      body: '',
      createdAt: Date.now(),
      isSelf: true,
      status: 'sending',
      reactions: [],
      images: [],
      repliedMessage
    }
    const payload: EventSendMessage = {
      roomId,
      message
    }

    isForwardingMessage.value = true
    try {
      await put(message)
      await mutate(roomId, (room) => {
        room.messages.push(message.id)
      })
      socket.emit('send-message', payload)
      closeMessageForwardDialog()
    } finally {
      isForwardingMessage.value = false
    }
  }

  watch(
    isMessageForwardDialogOpen,
    (isOpen) => {
      setClientUpdateReloadBlock(clientUpdateReloadBlockerId, isOpen)

      if (isOpen) return

      resetMessageForwardDialog()
    },
    { immediate: true }
  )

  onScopeDispose(() => {
    setClientUpdateReloadBlock(clientUpdateReloadBlockerId, false)
  })

  return {
    selectedMessageForwardRoomIds,
    messageForwardSearchQuery,
    filteredMessageForwardChatRoomItems,
    hasMessageForwardChatRooms,
    showMessageForwardSearchEmpty,
    canSelectMessageForwardRoom,
    isForwardingMessage,
    closeMessageForwardDialog,
    updateMessageForwardDialogOpen,
    updateSelectedMessageForwardRoomIds,
    selectMessageForwardRoom
  }
}
