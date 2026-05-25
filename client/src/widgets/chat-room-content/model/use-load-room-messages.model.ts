import type { EventLoadRoomMessages, EventRoomMessagesLoaded } from 'global-shared'
import { computed, reactive, type Ref } from 'vue'

import { useMessage } from 'src/entities/message'
import { useSocketAction } from 'src/shared/api'
import type { ChatRoomRecord } from 'src/shared/lib'

import { ROOM_MESSAGES_PAGE_LIMIT } from '../config/constants'

export const useLoadRoomMessages = (room?: Ref<ChatRoomRecord>) => {
  const { bulkPut } = useMessage()
  const { emitSocketAction } = useSocketAction()
  const loadingRoomIds = reactive(new Set<string>())
  const hasMoreMessagesByRoomId = reactive<Record<string, boolean | undefined>>({})
  const nextBeforeCreatedAtByRoomId = reactive<Record<string, number | undefined>>({})
  const roomId = computed(() => room?.value.id ?? '')

  const isRoomMessagesLoading = (roomId: string) => loadingRoomIds.has(roomId)
  const hasMoreRoomMessages = (roomId: string) => hasMoreMessagesByRoomId[roomId] ?? true
  const isLoading = computed(() => (roomId.value ? isRoomMessagesLoading(roomId.value) : false))
  const hasMoreMessages = computed(() => (roomId.value ? hasMoreRoomMessages(roomId.value) : true))

  const saveLoadedRoomMessages = async ({
    roomId,
    messages,
    hasMore,
    nextBeforeCreatedAt
  }: EventRoomMessagesLoaded) => {
    await bulkPut(messages)
    hasMoreMessagesByRoomId[roomId] = hasMore
    nextBeforeCreatedAtByRoomId[roomId] = nextBeforeCreatedAt
  }

  const loadRoomMessages = async (roomId: string, beforeCreatedAt = nextBeforeCreatedAtByRoomId[roomId]) => {
    if (isRoomMessagesLoading(roomId) || !hasMoreRoomMessages(roomId)) return

    const payload: EventLoadRoomMessages = {
      roomId,
      limit: ROOM_MESSAGES_PAGE_LIMIT,
      ...(beforeCreatedAt ? { beforeCreatedAt } : {})
    }

    loadingRoomIds.add(roomId)

    try {
      const response = await emitSocketAction<EventLoadRoomMessages, EventRoomMessagesLoaded>(
        'load-room-messages',
        payload
      )

      if (response.ok && response.payload) {
        await saveLoadedRoomMessages(response.payload)
      }
    } finally {
      loadingRoomIds.delete(roomId)
    }
  }

  const loadMessages = async () => {
    const selectedRoomId = roomId.value

    if (!selectedRoomId) return

    const beforeCreatedAt = nextBeforeCreatedAtByRoomId[selectedRoomId]

    await loadRoomMessages(selectedRoomId, beforeCreatedAt)
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

  return {
    loadingRoomIds,
    isLoading,
    hasMoreMessages,
    loadMessages,
    isRoomMessagesLoading,
    hasMoreRoomMessages,
    loadRoomMessages,
    resetRoomMessagesPagination
  }
}
