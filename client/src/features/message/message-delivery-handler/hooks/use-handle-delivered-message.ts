import { IEventMessageDelivered } from 'common'

import { useMessage } from 'src/entities/message'

import { notifyDeliveredMessage, useAddMessage } from '../..'

export const useHandleDeliveredMessage = () => {
  const { getMessageById, updateMessage } = useMessage()
  const { addMessage } = useAddMessage()

  const handleDeliveredMessage = async (payload: IEventMessageDelivered) => {
    const { roomId, message } = payload
    const existingMessage = getMessageById(message.id)
    if (existingMessage) {
      await updateMessage(message.id, {
        ...message,
        status: 'delivered'
      })
    } else {
      addMessage(roomId, message)
    }

    // TODO Do scroll to bottom
    notifyDeliveredMessage(payload)
  }

  return {
    handleDeliveredMessage
  }
}
