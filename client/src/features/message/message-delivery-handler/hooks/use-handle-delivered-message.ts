import { IEventMessageDelivered } from 'common'

import { notifyDeliveredMessage, useAddMessage } from 'src/features/message'

import { useMessage } from 'src/entities/message'

export const useHandleDeliveredMessage = () => {
  const { getById, update } = useMessage()
  const { addMessage } = useAddMessage()

  const handleDeliveredMessage = async (payload: IEventMessageDelivered) => {
    const { roomId, message } = payload
    const existingMessage = getById(message.id)
    if (existingMessage) {
      await update(message.id, {
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
