import { MESSAGE_LOAD_DIRECTION, type EventLoadRoomMessages } from 'global-shared'

const resolveAroundMessageIds = (messageIds: string[], anchorIndex: number, limit: number) => {
  const previousMessagesQuantity = Math.floor((limit - 1) / 2)
  let startIndex = anchorIndex - previousMessagesQuantity
  let endIndex = startIndex + limit

  if (startIndex < 0) {
    endIndex = Math.min(messageIds.length, endIndex - startIndex)
    startIndex = 0
  }

  if (endIndex > messageIds.length) {
    startIndex = Math.max(0, startIndex - (endIndex - messageIds.length))
    endIndex = messageIds.length
  }

  return messageIds.slice(startIndex, endIndex)
}

export const resolveRoomMessageWindowIds = (
  messageIds: string[],
  { anchorMessageId, direction, limit }: EventLoadRoomMessages
) => {
  if (direction === MESSAGE_LOAD_DIRECTION.LATEST) {
    return messageIds.slice(-limit)
  }

  if (!anchorMessageId) return []

  const anchorIndex = messageIds.indexOf(anchorMessageId)

  if (anchorIndex === -1) return []

  switch (direction) {
    case MESSAGE_LOAD_DIRECTION.BEFORE:
      return messageIds.slice(Math.max(0, anchorIndex - limit), anchorIndex)
    case MESSAGE_LOAD_DIRECTION.AFTER:
      return messageIds.slice(anchorIndex + 1, anchorIndex + 1 + limit)
    case MESSAGE_LOAD_DIRECTION.AROUND:
      return resolveAroundMessageIds(messageIds, anchorIndex, limit)
  }
}
