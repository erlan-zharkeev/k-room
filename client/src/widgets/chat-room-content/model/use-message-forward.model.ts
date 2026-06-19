import { type ChatRoom, type EventSendMessage, type Message } from 'global-shared'
import { v4 as uuidv4 } from 'uuid'
import { computed, type Ref, ref, toRef, watch } from 'vue'

import { getRoomOtherUserIds, isRoomPrivate, useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useUser } from 'src/entities/user'
import { socket, useSocketAvailability, useSocketTransportErrorToast } from 'src/shared/api'
import type { AppProfilePickerItem } from 'src/shared/ui'

import type { MessageForwardDialogProps } from '../config/types'
import { buildChatRoomTitle } from '../lib/build-chat-room-title'
import { buildRepliedMessage } from '../lib/build-replied-message'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useMessageForward = (props: MessageForwardDialogProps, isMessageForwardDialogOpen: Ref<boolean>) => {
  const forwardedMessage = toRef(props, 'message')
  const sourceRoomId = toRef(props, 'sourceRoomId')
  const { chatRooms, mutate } = useChatRoom()
  const { put } = useMessage()
  const { user } = useUser()
  const { isSocketOnlineActionAvailable } = useSocketAvailability()
  const { showSocketTransportErrorToast } = useSocketTransportErrorToast()
  const { getRoomInterlocutor, getUsersByIds } = useChatRoomUserLookup()
  const selectedMessageForwardRoomIds = ref<string[]>([])
  const messageForwardSearchQuery = ref('')
  const isForwardingMessage = ref(false)
  const normalizedMessageForwardSearchQuery = computed(() => messageForwardSearchQuery.value.trim().toLowerCase())

  const buildMessageForwardChatRoomItem = (room: ChatRoom): AppProfilePickerItem => {
    const isPrivateRoom = isRoomPrivate(room)
    const otherUserIds = getRoomOtherUserIds(room, user.value.id)
    const users = getUsersByIds(otherUserIds)
    const interlocutor = getRoomInterlocutor(room, user.value.id)

    return {
      id: room.id,
      imageId: isPrivateRoom ? interlocutor?.avatarId : room.avatarId,
      title: buildChatRoomTitle(room, users, isPrivateRoom),
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

  watch(isMessageForwardDialogOpen, (isOpen) => {
    if (isOpen) return

    resetMessageForwardDialog()
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
