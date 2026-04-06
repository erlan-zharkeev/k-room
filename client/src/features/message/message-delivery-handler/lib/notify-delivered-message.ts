import { IEventMessageDelivered } from 'common'

import { MessageNotification } from 'src/features/message'

import { useChatRoom } from 'src/entities/chat-room'
import { useSound } from 'src/entities/sound'

import { useNotification } from 'src/shared/notification'

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
