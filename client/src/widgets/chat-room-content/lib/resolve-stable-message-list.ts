import type { MessageListItem } from '../config/types'

const isSameMessageListItem = (item: MessageListItem, previousItem: MessageListItem) => {
  if (item.id !== previousItem.id) return false
  if (item.type !== previousItem.type) return false

  if (item.type === 'date-separator' && previousItem.type === 'date-separator') {
    return item.label === previousItem.label
  }

  return true
}

export const resolveStableMessageList = (
  messageList: MessageListItem[],
  previousMessageList: MessageListItem[] | undefined
) => {
  if (!previousMessageList) return messageList
  if (messageList.length !== previousMessageList.length) return messageList

  const isSameList = messageList.every((item, index) => isSameMessageListItem(item, previousMessageList[index]))

  return isSameList ? previousMessageList : messageList
}
