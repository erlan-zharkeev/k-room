import type { MessageListBuildParams, MessageLoadedRange, MessageListItem } from '../config/types'

import { createDateSeparatorItem, createMessageGapItem, createMessageItem } from './create-message-list-item'

const appendDateSeparator = (items: MessageListItem[], messageId: string, label: string, previousLabel: string) => {
  if (!label || previousLabel === label) return previousLabel

  items.push(createDateSeparatorItem(messageId, label))

  return label
}

const appendMessage = (items: MessageListItem[], messageId: string, previousLabel: string, params: MessageListBuildParams) => {
  const message = params.messageById.get(messageId)

  if (!message) return previousLabel

  const label = message.createdAt ? params.formatDate(message.createdAt) : ''
  const nextLabel = appendDateSeparator(items, message.id, label, previousLabel)

  items.push(createMessageItem(messageId))

  return nextLabel
}

const appendRange = (
  items: MessageListItem[],
  range: MessageLoadedRange,
  rangeIndex: number,
  previousLabel: string,
  params: MessageListBuildParams
) => {
  const messageIds = params.messageIds.slice(range.startIndex, range.endIndex + 1)
  const initialLabel = rangeIndex > 0 ? '' : previousLabel

  if (rangeIndex > 0) {
    items.push(createMessageGapItem(params.roomId, range))
  }

  return messageIds.reduce((label, messageId) => appendMessage(items, messageId, label, params), initialLabel)
}

export const buildMessageList = (params: MessageListBuildParams) => {
  const items: MessageListItem[] = []

  params.loadedMessageRanges.reduce(
    (previousLabel, range, rangeIndex) => appendRange(items, range, rangeIndex, previousLabel, params),
    ''
  )

  return items
}
