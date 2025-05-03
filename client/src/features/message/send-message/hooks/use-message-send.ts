import { SocketActionsType, IEventMessageDelivered, IEventSendMessage, IMessage } from 'common-types'
import { useDispatch } from 'react-redux'

import { pushMessage, useChatRooms, resetRepliedMessage, pushTemporaryMessage } from 'src/entities/chat-room'
import { useNotification } from 'src/entities/notification'
import { useSound } from 'src/entities/sound'

import { socket } from 'src/shared/api'
import { generateUUIDv4 } from 'src/shared/utils'

import { ISendMessagePayload } from '../types'
import { MessageNotification } from '../ui'

export const useMessageSend = () => {
  const { getNotification, openBrowserNotification } = useNotification()
  const { play } = useSound()
  const { getRoomById } = useChatRooms()

  const dispatch = useDispatch()

  const sendMessage = (data: ISendMessagePayload) => {
    const {
      authorId,
      messageText,
      roomId,
      username,
      images = [],
      imageCompression = true,
      repliedMessage = null
    } = data

    const message: IMessage = {
      authorId,
      images,
      imageCompression,
      repliedMessage,
      id: '',
      tempId: generateUUIDv4(),
      status: 'sending',
      authorName: username,
      body: messageText,
      createdAt: String(Date.now())
    }

    const payload: IEventSendMessage = {
      roomId,
      message
    }

    socket.emit<SocketActionsType>('send-message', payload)
    dispatch(resetRepliedMessage())
    dispatch(pushTemporaryMessage({ roomId, message }))
  }

  const notifyIncomeMessage = (payload: IEventMessageDelivered) => {
    if (payload.message.isSelf) return
    const { message, roomId } = payload
    const incomeMessageNotification = getNotification({
      message: MessageNotification(message),
      messageType: 'info'
    })
    incomeMessageNotification.open()
    openBrowserNotification({ message, icon: getRoomById(roomId)?.avatarPath })
    play('message-delivered')
  }

  const pushNewMessage = (payload: IEventMessageDelivered) => {
    dispatch(pushMessage(payload))
    // Do scroll to bottom
    notifyIncomeMessage(payload)
  }

  const monitorMessageDelivered = () => {
    socket.on<SocketActionsType>('message-delivered', pushNewMessage)
  }

  return {
    monitorMessageDelivered,
    sendMessage
  }
}
