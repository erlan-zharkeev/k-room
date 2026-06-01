import {
  MESSAGE_LOAD_DIRECTION,
  type ChatRoom,
  type EventLoadRoomMessages,
  type EventRoomMessagesLoaded,
  type MessageLoadDirection
} from 'global-shared'
import { computed, reactive, type Ref } from 'vue'

import { useMessage } from 'src/entities/message'
import { useSocketAction } from 'src/shared/api'

import { ROOM_MESSAGES_PAGE_LIMIT } from '../config/constants'
import type { MessageLoadedRange } from '../config/types'

const loadingRoomMessageRanges = reactive(new Set<string>())
const loadedMessageRangesByRoomId = reactive<Record<string, MessageLoadedRange[] | undefined>>({})

const createLoadKey = (roomId: string, direction: MessageLoadDirection, anchorMessageId = '') =>
  `${roomId}:${direction}:${anchorMessageId}`

const createLoadedRangesFromIndexes = (indexes: number[]) => {
  const sortedIndexes = [...new Set(indexes)].sort((current, next) => current - next)

  return sortedIndexes.reduce<MessageLoadedRange[]>((ranges, index) => {
    const currentRange = ranges[ranges.length - 1]

    if (currentRange && index <= currentRange.endIndex + 1) {
      currentRange.endIndex = Math.max(currentRange.endIndex, index)

      return ranges
    }

    ranges.push({
      startIndex: index,
      endIndex: index
    })

    return ranges
  }, [])
}

const normalizeLoadedMessageRanges = (ranges: MessageLoadedRange[]) => {
  const sortedRanges = [...ranges].sort((current, next) => current.startIndex - next.startIndex)

  return sortedRanges.reduce<MessageLoadedRange[]>((normalizedRanges, range) => {
    const currentRange = normalizedRanges[normalizedRanges.length - 1]

    if (currentRange && range.startIndex <= currentRange.endIndex + 1) {
      currentRange.endIndex = Math.max(currentRange.endIndex, range.endIndex)

      return normalizedRanges
    }

    normalizedRanges.push({ ...range })

    return normalizedRanges
  }, [])
}

const selectLoadedMessageRanges = (roomId: string) => loadedMessageRangesByRoomId[roomId] ?? []

const updateLoadedMessageRanges = (roomId: string, indexes: number[]) => {
  if (!indexes.length) return

  const currentRanges = selectLoadedMessageRanges(roomId)
  const loadedRanges = createLoadedRangesFromIndexes(indexes)

  loadedMessageRangesByRoomId[roomId] = normalizeLoadedMessageRanges([...currentRanges, ...loadedRanges])
}

const resolveMessageIndexes = (room: ChatRoom, messages: EventRoomMessagesLoaded['messages']) =>
  messages.flatMap(({ id }) => {
    const index = room.messages.indexOf(id)

    return index === -1 ? [] : [index]
  })

const findLoadedRangeByMessageIndex = (roomId: string, index: number) =>
  selectLoadedMessageRanges(roomId).find((range) => index >= range.startIndex && index <= range.endIndex)

const isMessageIndexLoaded = (roomId: string, index: number) => Boolean(findLoadedRangeByMessageIndex(roomId, index))

const isRoomMessagesLoading = (roomId: string) =>
  Array.from(loadingRoomMessageRanges).some((key) => key.startsWith(`${roomId}:`))

const reconcileLoadedMessageRanges = (roomId: string, previousMessageIds: string[], currentMessageIds: string[]) => {
  const currentRanges = selectLoadedMessageRanges(roomId)
  const hasCurrentRanges = Boolean(currentRanges.length)
  const hadMessages = Boolean(previousMessageIds.length)
  const hasCurrentMessages = Boolean(currentMessageIds.length)
  const shouldCreateInitialRange = !hasCurrentRanges && !hadMessages && hasCurrentMessages

  if (shouldCreateInitialRange) {
    loadedMessageRangesByRoomId[roomId] = [
      {
        startIndex: 0,
        endIndex: currentMessageIds.length - 1
      }
    ]

    return
  }

  if (!hasCurrentRanges) return

  const loadedMessageIds = new Set(
    currentRanges.flatMap(({ startIndex, endIndex }) => previousMessageIds.slice(startIndex, endIndex + 1))
  )
  const previousLastMessageIndex = previousMessageIds.length - 1
  const previousLastMessageId = previousMessageIds[previousLastMessageIndex]
  const previousLastCurrentIndex = previousLastMessageId ? currentMessageIds.indexOf(previousLastMessageId) : -1
  const isPreviousLastMessageLoaded = isMessageIndexLoaded(roomId, previousLastMessageIndex)

  if (isPreviousLastMessageLoaded && previousLastCurrentIndex !== -1) {
    currentMessageIds.slice(previousLastCurrentIndex + 1).forEach((messageId) => loadedMessageIds.add(messageId))
  }

  const loadedIndexes = currentMessageIds.flatMap((messageId, index) =>
    loadedMessageIds.has(messageId) ? [index] : []
  )

  loadedMessageRangesByRoomId[roomId] = createLoadedRangesFromIndexes(loadedIndexes)
}

export const useLoadRoomMessages = (room?: Ref<ChatRoom>) => {
  const { bulkPut } = useMessage()
  const { emitSocketAction } = useSocketAction()
  const roomId = computed(() => room?.value.id ?? '')
  const loadedMessageRanges = computed(() => selectLoadedMessageRanges(roomId.value))
  const isLoading = computed(() => (roomId.value ? isRoomMessagesLoading(roomId.value) : false))
  const hasLoadedMessages = computed(() => Boolean(loadedMessageRanges.value.length))

  const saveLoadedRoomMessages = async (targetRoom: ChatRoom, payload: EventRoomMessagesLoaded) => {
    await bulkPut(payload.messages)
    updateLoadedMessageRanges(targetRoom.id, resolveMessageIndexes(targetRoom, payload.messages))
  }

  const loadRoomMessages = async (targetRoom: ChatRoom, direction: MessageLoadDirection, anchorMessageId?: string) => {
    const loadKey = createLoadKey(targetRoom.id, direction, anchorMessageId)

    if (loadingRoomMessageRanges.has(loadKey)) return

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

    await loadRoomMessages(room.value, MESSAGE_LOAD_DIRECTION.LATEST)
  }

  const loadMessagesBeforeRange = (targetRoom: ChatRoom, range: MessageLoadedRange) => {
    const anchorMessageId = targetRoom.messages[range.startIndex]

    if (!anchorMessageId) return Promise.resolve()

    return loadRoomMessages(targetRoom, MESSAGE_LOAD_DIRECTION.BEFORE, anchorMessageId)
  }

  const loadMessagesAfterRange = (targetRoom: ChatRoom, range: MessageLoadedRange) => {
    const anchorMessageId = targetRoom.messages[range.endIndex]

    if (!anchorMessageId) return Promise.resolve()

    return loadRoomMessages(targetRoom, MESSAGE_LOAD_DIRECTION.AFTER, anchorMessageId)
  }

  const loadMessagesAround = async (messageId: string) => {
    if (!room?.value) return

    await loadRoomMessages(room.value, MESSAGE_LOAD_DIRECTION.AROUND, messageId)
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
    resetLoadedMessageRanges
  }
}
