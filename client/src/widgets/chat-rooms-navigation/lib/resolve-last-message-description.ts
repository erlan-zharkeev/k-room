import type { MessageRecord } from 'src/shared/lib'

export const resolveLastMessageDescription = (
  lastMessage: MessageRecord | undefined,
  imageMessageText: string,
  replyMessageText: string,
  forwardMessageText: string
) => {
  if (!lastMessage) return ''

  const hasMessageBody = Boolean(lastMessage.body.trim())
  const hasMessageImages = Boolean(lastMessage.images?.length)
  const { repliedMessage } = lastMessage

  if (hasMessageBody) return lastMessage.body
  if (hasMessageImages) return imageMessageText
  if (repliedMessage) {
    const actionText = repliedMessage.forward ? forwardMessageText : replyMessageText
    const hasRepliedMessageBody = Boolean(repliedMessage.body.trim())
    const hasRepliedMessageImages = Boolean(repliedMessage.images?.length)

    if (hasRepliedMessageBody) return `${actionText}: ${repliedMessage.body}`
    if (hasRepliedMessageImages) return `${actionText}: ${imageMessageText}`

    return actionText
  }

  return ''
}
