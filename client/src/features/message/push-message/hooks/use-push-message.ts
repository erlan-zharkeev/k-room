import { IEventMessageDelivered } from 'common-types'

import { useAddMessage } from 'src/features/message/add-message'
import { MessageNotification } from 'src/features/message/send-message'

import { useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useNotification } from 'src/entities/notification'
import { useSound } from 'src/entities/sound'

export const usePushMessage = () => {
  const { getNotification, openBrowserNotification } = useNotification()
  const { play } = useSound()
  const { getRoomById } = useChatRoom()
  const { getMessageById, updateMessage } = useMessage()
  const { addMessage } = useAddMessage()

  const notifyIncomeMessage = (payload: IEventMessageDelivered) => {
    if (payload.message.isSelf) return
    const { message, roomId } = payload
    const incomeMessageNotification = getNotification({
      message: MessageNotification(message),
      messageType: 'info'
    })
    incomeMessageNotification.open()
    openBrowserNotification({ message, icon: getRoomById(roomId)?.avatarId })
    play('message-delivered')
  }

  const pushMessage = async (payload: IEventMessageDelivered) => {
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

    console.log('[message/delivery] messageId', payload.message.id)
    // TODO Do scroll to bottom
    notifyIncomeMessage(payload)
  }

  return {
    pushMessage
  }
}
