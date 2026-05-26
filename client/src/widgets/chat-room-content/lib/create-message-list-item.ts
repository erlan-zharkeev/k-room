import type { MessageLoadedRange, MessageListItem } from '../config/types'

export const createMessageGapItem = (roomId: string, range: MessageLoadedRange): MessageListItem => ({
  type: 'message-gap',
  id: `message-gap-${roomId}-${range.startIndex}`
})

export const createDateSeparatorItem = (messageId: string, label: string): MessageListItem => ({
  type: 'date-separator',
  id: `date-separator-${messageId}`,
  label
})

export const createMessageItem = (messageId: string): MessageListItem => ({
  type: 'message',
  id: messageId,
  messageId
})
