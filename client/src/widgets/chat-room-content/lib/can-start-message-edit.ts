import { type Message } from 'global-shared'

export const canStartMessageEdit = (message: Message) => {
  const isOwnMessage = Boolean(message.isSelf)
  const hasEditableBody = Boolean(message.body.trim())
  const isSendingMessage = message.status === 'sending'
  const hasEditableMessage = isOwnMessage && hasEditableBody

  return hasEditableMessage && !isSendingMessage
}
