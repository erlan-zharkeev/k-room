import { IEventMessageDelivered } from 'common-types'

import { useChatRoom } from 'src/entities/chat-room'
import { useNotification } from 'src/entities/notification'
import { useSound } from 'src/entities/sound'

import { MessageNotification } from '../ui'

export const notifyDeliveredMessage = (payload: IEventMessageDelivered) => {
  const { getNotification, openBrowserNotification } = useNotification()
  const { play } = useSound()
  const { getRoomById } = useChatRoom()

  if (payload.message.isSelf) return
  const { message, roomId } = payload
  const incomeMessageNotification = getNotification({
    message: MessageNotification(message),
    messageType: 'info',
    placement: 'topRight'
  })
  incomeMessageNotification.open()
  openBrowserNotification({ message, icon: getRoomById(roomId)?.avatarId })
  play('message-delivered')
}
