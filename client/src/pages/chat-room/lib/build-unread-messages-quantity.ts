import type { DbMessageType } from 'src/shared/lib'

export const buildUnreadMessagesQuantity = (messageIds: string[], messages: DbMessageType[]) => {
  const messageIdSet = new Set(messageIds)

  return messages.filter(({ id, isSelf, status }) => messageIdSet.has(id) && !isSelf && status === 'delivered').length
}
