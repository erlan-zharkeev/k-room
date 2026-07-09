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

const resolveCachedRoomMessageRange = (targetRoom: ChatRoom, anchorMessageId?: string) => {
  const lastIndex = targetRoom.messages.length - 1

  if (lastIndex < 0) return null

  const anchorIndex = anchorMessageId ? targetRoom.messages.indexOf(anchorMessageId) : lastIndex
  const targetIndex = anchorIndex === -1 ? lastIndex : anchorIndex
  const halfLimit = Math.floor(ROOM_MESSAGES_PAGE_LIMIT / 2)
  const preferredStartIndex = anchorMessageId ? targetIndex - halfLimit : targetIndex - ROOM_MESSAGES_PAGE_LIMIT + 1
  const startIndex = Math.max(0, preferredStartIndex)
  const endIndex = Math.min(lastIndex, startIndex + ROOM_MESSAGES_PAGE_LIMIT - 1)

  return {
    startIndex: Math.max(0, endIndex - ROOM_MESSAGES_PAGE_LIMIT + 1),
    endIndex
  }
}

export const useLoadRoomMessages = (room?: Ref<ChatRoom>) => {
  const { bulkPut, loadByIds } = useMessage()
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

  const loadCachedRoomMessageRange = async (targetRoom: ChatRoom, startIndex: number, endIndex: number) => {
    const messageIds = targetRoom.messages.slice(startIndex, endIndex + 1)
    const messages = await loadByIds(messageIds)

    updateLoadedMessageRanges(targetRoom.id, resolveLoadedRoomMessageIndexes(targetRoom, messages))
  }

  const restoreCachedLoadedMessageRanges = async (targetRoom: ChatRoom, anchorMessageId?: string) => {
    const currentRanges = selectLoadedMessageRanges(targetRoom.id)

    if (currentRanges.length) return

    const range = resolveCachedRoomMessageRange(targetRoom, anchorMessageId)

    if (!range) return

    await loadCachedRoomMessageRange(targetRoom, range.startIndex, range.endIndex)
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

    await restoreCachedLoadedMessageRanges(room.value)
    await loadRoomMessages(room.value, 'latest')
  }

  const loadMessagesBeforeRange = async (targetRoom: ChatRoom, range: MessageLoadedRange) => {
    const anchorMessageId = targetRoom.messages[range.startIndex]

    if (!anchorMessageId) return Promise.resolve()

    if (range.startIndex > 0) {
      await loadCachedRoomMessageRange(
        targetRoom,
        Math.max(0, range.startIndex - ROOM_MESSAGES_PAGE_LIMIT),
        range.startIndex - 1
      )
    }

    return loadRoomMessages(targetRoom, 'before', anchorMessageId)
  }

  const loadMessagesAfterRange = async (targetRoom: ChatRoom, range: MessageLoadedRange) => {
    const anchorMessageId = targetRoom.messages[range.endIndex]

    if (!anchorMessageId) return Promise.resolve()

    if (range.endIndex < targetRoom.messages.length - 1) {
      await loadCachedRoomMessageRange(
        targetRoom,
        range.endIndex + 1,
        Math.min(targetRoom.messages.length - 1, range.endIndex + ROOM_MESSAGES_PAGE_LIMIT)
      )
    }

    return loadRoomMessages(targetRoom, 'after', anchorMessageId)
  }

  const loadMessagesAround = async (messageId: string) => {
    if (!room?.value) return

    const range = resolveCachedRoomMessageRange(room.value, messageId)

    if (range) {
      await loadCachedRoomMessageRange(room.value, range.startIndex, range.endIndex)
    }

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
