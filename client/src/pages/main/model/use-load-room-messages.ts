import type { IEventLoadRoomMessages, IEventRoomMessagesLoaded, SocketActionsType } from 'global-shared'
import { onBeforeUnmount, ref } from 'vue'

import { socket } from 'src/shared/api'

import { ROOM_MESSAGES_PAGE_LIMIT } from '../config/constants'

import { useMessage } from './use-message'

export const useLoadRoomMessages = () => {
  const { bulkPut } = useMessage()
  const isLoading = ref(false)
  const hasMoreMessages = ref(true)
  const nextBeforeCreatedAt = ref<number | undefined>()

  const loadRoomMessages = (roomId: string, beforeCreatedAt = nextBeforeCreatedAt.value) => {
    if (isLoading.value || !hasMoreMessages.value) return

    const payload: IEventLoadRoomMessages = {
      roomId,
      limit: ROOM_MESSAGES_PAGE_LIMIT,
      ...(beforeCreatedAt ? { beforeCreatedAt } : {})
    }

    isLoading.value = true
    socket.emit<SocketActionsType>('load-room-messages', payload)
  }

  const handleRoomMessagesLoaded = async ({
    messages,
    hasMore,
    nextBeforeCreatedAt: nextPage
  }: IEventRoomMessagesLoaded) => {
    await bulkPut(messages)
    hasMoreMessages.value = hasMore
    nextBeforeCreatedAt.value = nextPage
    isLoading.value = false
  }

  const resetRoomMessagesPagination = () => {
    hasMoreMessages.value = true
    nextBeforeCreatedAt.value = undefined
    isLoading.value = false
  }

  const initializeLoadRoomMessages = () => {
    socket.on<SocketActionsType>('room-messages-loaded', handleRoomMessagesLoaded)
  }

  const disposeLoadRoomMessages = () => {
    socket.off<SocketActionsType>('room-messages-loaded', handleRoomMessagesLoaded)
  }

  onBeforeUnmount(disposeLoadRoomMessages)

  return {
    isLoading,
    hasMoreMessages,
    loadRoomMessages,
    resetRoomMessagesPagination,
    initializeLoadRoomMessages,
    disposeLoadRoomMessages
  }
}
