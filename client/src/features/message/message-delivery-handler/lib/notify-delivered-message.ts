import { IEventMessageDelivered } from 'common'

import { MessageNotification } from 'src/features/message/message-delivery-handler'

import { useChatRoom } from 'src/entities/chat-room'
import { useNotification } from 'src/entities/notification'
import { useSound } from 'src/entities/sound'

export const notifyDeliveredMessage = (payload: IEventMessageDelivered) => {
  const { getNotification, openBrowserNotification } = useNotification()
  const { play } = useSound()
  const { getById } = useChatRoom()

  if (payload.message.isSelf) return
  const { message, roomId } = payload
  const incomeMessageNotification = getNotification({
    message: MessageNotification(message),
    messageType: 'info',
    placement: 'topRight'
  })
  incomeMessageNotification.open()
  openBrowserNotification({ message, icon: getById(roomId)?.avatarId })
  play('message-delivered')
}
