import { Message } from './../../../types'

const getLastMessage = (messages: Array<Message>): string => {
  if (!messages) return ''
  return messages[messages.length - 1]?.body ?? ''
}

export default getLastMessage
