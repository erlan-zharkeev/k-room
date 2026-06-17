import { MESSAGE_STATUS_VALUE, type Message } from 'global-shared'

export const canStartMessageEdit = (message: Message) => {
  const isOwnMessage = Boolean(message.isSelf)
  const hasEditableBody = Boolean(message.body.trim())
  const isSendingMessage = message.status === MESSAGE_STATUS_VALUE.SENDING
  const hasEditableMessage = isOwnMessage && hasEditableBody

  return hasEditableMessage && !isSendingMessage
}
