import type { IEventLoadRoomMessages, IEventRoomMessagesLoaded, SocketActionsType } from 'global-shared'
import { computed, onBeforeUnmount, reactive, type Ref } from 'vue'

import { useMessage } from 'src/entities/message'
import { socket } from 'src/shared/api'
import type { FChatRoomType } from 'src/shared/lib'

import { ROOM_MESSAGES_PAGE_LIMIT } from '../config/constants'

export const useLoadRoomMessages = (room?: Ref<FChatRoomType>) => {
  const { bulkPut } = useMessage()
  const loadingRoomIds = reactive(new Set<string>())
  const hasMoreMessagesByRoomId = reactive<Record<string, boolean | undefined>>({})
  const nextBeforeCreatedAtByRoomId = reactive<Record<string, number | undefined>>({})
  const roomId = computed(() => room?.value.id ?? '')

  const isRoomMessagesLoading = (roomId: string) => loadingRoomIds.has(roomId)
  const hasMoreRoomMessages = (roomId: string) => hasMoreMessagesByRoomId[roomId] ?? true
  const isLoading = computed(() => (roomId.value ? isRoomMessagesLoading(roomId.value) : false))
  const hasMoreMessages = computed(() => (roomId.value ? hasMoreRoomMessages(roomId.value) : true))

  const loadRoomMessages = (roomId: string, beforeCreatedAt = nextBeforeCreatedAtByRoomId[roomId]) => {
    if (isRoomMessagesLoading(roomId) || !hasMoreRoomMessages(roomId)) return

    const payload: IEventLoadRoomMessages = {
      roomId,
      limit: ROOM_MESSAGES_PAGE_LIMIT,
      ...(beforeCreatedAt ? { beforeCreatedAt } : {})
    }

    loadingRoomIds.add(roomId)
    socket.emit<SocketActionsType>('load-room-messages', payload)
  }

  const loadMessages = (beforeCreatedAt = nextBeforeCreatedAtByRoomId[roomId.value]) => {
    if (!roomId.value) return
    loadRoomMessages(roomId.value, beforeCreatedAt)
  }

  const handleRoomMessagesLoaded = async ({
    roomId,
    messages,
    hasMore,
    nextBeforeCreatedAt: nextPage
  }: IEventRoomMessagesLoaded) => {
    await bulkPut(messages)
    hasMoreMessagesByRoomId[roomId] = hasMore
    nextBeforeCreatedAtByRoomId[roomId] = nextPage
    loadingRoomIds.delete(roomId)
  }

  const resetRoomMessagesPagination = (roomId?: string) => {
    if (!roomId) {
      Object.keys(hasMoreMessagesByRoomId).forEach((id) => {
        delete hasMoreMessagesByRoomId[id]
        delete nextBeforeCreatedAtByRoomId[id]
      })
      loadingRoomIds.clear()
      return
    }

    delete hasMoreMessagesByRoomId[roomId]
    delete nextBeforeCreatedAtByRoomId[roomId]
    loadingRoomIds.delete(roomId)
  }

  const initializeLoadRoomMessages = () => {
    socket.on<SocketActionsType>('room-messages-loaded', handleRoomMessagesLoaded)
  }

  const disposeLoadRoomMessages = () => {
    socket.off<SocketActionsType>('room-messages-loaded', handleRoomMessagesLoaded)
  }

  onBeforeUnmount(disposeLoadRoomMessages)

  return {
    loadingRoomIds,
    isLoading,
    hasMoreMessages,
    loadMessages,
    isRoomMessagesLoading,
    hasMoreRoomMessages,
    loadRoomMessages,
    resetRoomMessagesPagination,
    initializeLoadRoomMessages,
    disposeLoadRoomMessages
  }
}
