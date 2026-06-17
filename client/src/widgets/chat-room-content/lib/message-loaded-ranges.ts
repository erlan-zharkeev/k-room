import type { ChatRoom, EventRoomMessagesLoaded, MessageLoadDirection } from 'global-shared'

import type { MessageLoadedRange } from '../config/types'

export const buildRoomMessageLoadKey = (roomId: string, direction: MessageLoadDirection, anchorMessageId = '') =>
  `${roomId}:${direction}:${anchorMessageId}`

export const buildLoadedMessageRangesFromIndexes = (indexes: number[]) => {
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

export const mergeLoadedMessageRanges = (ranges: MessageLoadedRange[]) => {
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

export const resolveLoadedRoomMessageIndexes = (room: ChatRoom, messages: EventRoomMessagesLoaded['messages']) =>
  messages.flatMap(({ id }) => {
    const index = room.messages.indexOf(id)

    return index === -1 ? [] : [index]
  })

const isMessageIndexInLoadedRanges = (ranges: MessageLoadedRange[], index: number) =>
  ranges.some((range) => index >= range.startIndex && index <= range.endIndex)

export const resolveReconciledLoadedMessageRanges = (
  currentRanges: MessageLoadedRange[],
  previousMessageIds: string[],
  currentMessageIds: string[]
) => {
  const hasCurrentRanges = Boolean(currentRanges.length)
  const hadMessages = Boolean(previousMessageIds.length)
  const hasCurrentMessages = Boolean(currentMessageIds.length)
  const shouldCreateInitialRange = !hasCurrentRanges && !hadMessages && hasCurrentMessages

  if (shouldCreateInitialRange) {
    return [
      {
        startIndex: 0,
        endIndex: currentMessageIds.length - 1
      }
    ]
  }

  if (!hasCurrentRanges) return currentRanges

  const loadedMessageIds = new Set(
    currentRanges.flatMap(({ startIndex, endIndex }) => previousMessageIds.slice(startIndex, endIndex + 1))
  )
  const previousLastMessageIndex = previousMessageIds.length - 1
  const previousLastMessageId = previousMessageIds[previousLastMessageIndex]
  const previousLastCurrentIndex = previousLastMessageId ? currentMessageIds.indexOf(previousLastMessageId) : -1
  const isPreviousLastMessageLoaded = isMessageIndexInLoadedRanges(currentRanges, previousLastMessageIndex)

  if (isPreviousLastMessageLoaded && previousLastCurrentIndex !== -1) {
    currentMessageIds.slice(previousLastCurrentIndex + 1).forEach((messageId) => loadedMessageIds.add(messageId))
  }

  const loadedIndexes = currentMessageIds.flatMap((messageId, index) =>
    loadedMessageIds.has(messageId) ? [index] : []
  )

  return buildLoadedMessageRangesFromIndexes(loadedIndexes)
}
