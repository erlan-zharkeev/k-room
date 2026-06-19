import {
  type ChatRoom,
  type EventLoadRoomMessages,
  type EventRoomMessagesLoaded,
  type MessageLoadDirection
} from 'global-shared'
import { computed, reactive, type Ref } from 'vue'

import { useMessage } from 'src/entities/message'
import { useSocketAction, useSocketAvailability } from 'src/shared/api'

import { ROOM_MESSAGES_PAGE_LIMIT } from '../config/constants'
import type { MessageLoadedRange } from '../config/types'
import {
  buildLoadedMessageRangesFromIndexes,
  buildRoomMessageLoadKey,
  mergeLoadedMessageRanges,
  resolveLoadedRoomMessageIndexes,
  resolveReconciledLoadedMessageRanges
} from '../lib/message-loaded-ranges'

const loadingRoomMessageRanges = reactive(new Set<string>())
const loadedMessageRangesByRoomId = reactive<Record<string, MessageLoadedRange[] | undefined>>({})

const selectLoadedMessageRanges = (roomId: string) => loadedMessageRangesByRoomId[roomId] ?? []

const updateLoadedMessageRanges = (roomId: string, indexes: number[]) => {
  if (!indexes.length) return

  const currentRanges = selectLoadedMessageRanges(roomId)
  const loadedRanges = buildLoadedMessageRangesFromIndexes(indexes)

  loadedMessageRangesByRoomId[roomId] = mergeLoadedMessageRanges([...currentRanges, ...loadedRanges])
}

const findLoadedRangeByMessageIndex = (roomId: string, index: number) =>
  selectLoadedMessageRanges(roomId).find((range) => index >= range.startIndex && index <= range.endIndex)

const isRoomMessagesLoading = (roomId: string) =>
  Array.from(loadingRoomMessageRanges).some((key) => key.startsWith(`${roomId}:`))

const reconcileLoadedMessageRanges = (roomId: string, previousMessageIds: string[], currentMessageIds: string[]) => {
  const currentRanges = selectLoadedMessageRanges(roomId)
  const reconciledRanges = resolveReconciledLoadedMessageRanges(currentRanges, previousMessageIds, currentMessageIds)

  loadedMessageRangesByRoomId[roomId] = reconciledRanges
}

export const useLoadRoomMessages = (room?: Ref<ChatRoom>) => {
  const { bulkPut, messageById } = useMessage()
  const { emitSocketAction } = useSocketAction()
  const { isSocketOnlineActionAvailable } = useSocketAvailability()
  const roomId = computed(() => room?.value.id ?? '')
  const loadedMessageRanges = computed(() => selectLoadedMessageRanges(roomId.value))
  const isLoading = computed(() => (roomId.value ? isRoomMessagesLoading(roomId.value) : false))
  const hasLoadedMessages = computed(() => Boolean(loadedMessageRanges.value.length))

  const saveLoadedRoomMessages = async (targetRoom: ChatRoom, payload: EventRoomMessagesLoaded) => {
    await bulkPut(payload.messages)
    updateLoadedMessageRanges(targetRoom.id, resolveLoadedRoomMessageIndexes(targetRoom, payload.messages))
  }

  const restoreCachedLoadedMessageRanges = (targetRoom: ChatRoom) => {
    const currentRanges = selectLoadedMessageRanges(targetRoom.id)

    if (currentRanges.length) return

    const loadedIndexes = targetRoom.messages.flatMap((messageId, index) =>
      messageById.value.has(messageId) ? [index] : []
    )

    loadedMessageRangesByRoomId[targetRoom.id] = buildLoadedMessageRangesFromIndexes(loadedIndexes)
  }

  const loadRoomMessages = async (targetRoom: ChatRoom, direction: MessageLoadDirection, anchorMessageId?: string) => {
    const loadKey = buildRoomMessageLoadKey(targetRoom.id, direction, anchorMessageId)

    if (loadingRoomMessageRanges.has(loadKey)) return

    if (!isSocketOnlineActionAvailable.value) return

    const payload: EventLoadRoomMessages = {
      roomId: targetRoom.id,
      limit: ROOM_MESSAGES_PAGE_LIMIT,
      direction,
      ...(anchorMessageId && { anchorMessageId })
    }

    loadingRoomMessageRanges.add(loadKey)

    try {
      const response = await emitSocketAction('load-room-messages', payload)

      if (response.ok) {
        await saveLoadedRoomMessages(targetRoom, response.payload)
      }
    } finally {
      loadingRoomMessageRanges.delete(loadKey)
    }
  }

  const loadLatestMessages = async () => {
    if (!room?.value) return

    await loadRoomMessages(room.value, 'latest')
  }

  const loadMessagesBeforeRange = (targetRoom: ChatRoom, range: MessageLoadedRange) => {
    const anchorMessageId = targetRoom.messages[range.startIndex]

    if (!anchorMessageId) return Promise.resolve()

    return loadRoomMessages(targetRoom, 'before', anchorMessageId)
  }

  const loadMessagesAfterRange = (targetRoom: ChatRoom, range: MessageLoadedRange) => {
    const anchorMessageId = targetRoom.messages[range.endIndex]

    if (!anchorMessageId) return Promise.resolve()

    return loadRoomMessages(targetRoom, 'after', anchorMessageId)
  }

  const loadMessagesAround = async (messageId: string) => {
    if (!room?.value) return

    await loadRoomMessages(room.value, 'around', messageId)
  }

  const resetLoadedMessageRanges = (roomId?: string) => {
    if (!roomId) {
      Object.keys(loadedMessageRangesByRoomId).forEach((id) => {
        delete loadedMessageRangesByRoomId[id]
      })
      loadingRoomMessageRanges.clear()
      return
    }

    delete loadedMessageRangesByRoomId[roomId]
    Array.from(loadingRoomMessageRanges)
      .filter((key) => key.startsWith(`${roomId}:`))
      .forEach((key) => loadingRoomMessageRanges.delete(key))
  }

  return {
    loadedMessageRanges,
    isLoading,
    hasLoadedMessages,
    findLoadedRangeByMessageIndex,
    isRoomMessagesLoading,
    loadLatestMessages,
    loadMessagesAfterRange,
    loadMessagesAround,
    loadMessagesBeforeRange,
    reconcileLoadedMessageRanges,
    restoreCachedLoadedMessageRanges,
    resetLoadedMessageRanges
  }
}
