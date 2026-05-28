import type { MessageRecord } from 'src/shared/lib'

export const resolveLastMessageDescription = (lastMessage: MessageRecord | undefined, imageMessageText: string) => {
  if (!lastMessage) return ''

  const hasMessageBody = Boolean(lastMessage.body.trim())
  const hasMessageImages = Boolean(lastMessage.images?.length)

  if (hasMessageBody) return lastMessage.body
  if (hasMessageImages) return imageMessageText

  return ''
}
