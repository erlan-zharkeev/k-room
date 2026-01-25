import { IEventMessageDelivered } from 'common-types'
// import { useDispatch } from 'react-redux'

import { useChatRoom } from 'src/entities/chat-room'
import { useNotification } from 'src/entities/notification'
import { useSound } from 'src/entities/sound'

import { MessageNotification } from '../../send-message/ui'

export const usePushMessage = () => {
  const { getNotification, openBrowserNotification } = useNotification()
  const { play } = useSound()
  // const dispatch = useDispatch()
  const { getRoomById } = useChatRoom()

  const notifyIncomeMessage = (payload: IEventMessageDelivered) => {
    if (payload.message.isSelf) return
    const { message, roomId } = payload
    const incomeMessageNotification = getNotification({
      message: MessageNotification(message),
      messageType: 'info'
    })
    console.log('l')
    incomeMessageNotification.open()
    openBrowserNotification({ message, icon: getRoomById(roomId)?.avatarId })
    play('message-delivered')
  }

  const pushMessage = (payload: IEventMessageDelivered) => {
    // dispatch(pushMessage(payload))
    // Do scroll to bottom
    notifyIncomeMessage(payload)
  }

  return {
    pushMessage
  }
}
