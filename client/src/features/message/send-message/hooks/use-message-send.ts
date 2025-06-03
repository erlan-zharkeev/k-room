import { FormEvent, useRef } from 'react'

import {
  SocketActionsType,
  IEventMessageDelivered,
  IEventSendMessage,
  IMessage,
  IChatRoom,
  FileLoaderValueType,
  IImageObject
} from 'common-types'
import { useDispatch } from 'react-redux'

import { useContactTyping } from 'src/features/contact'

import {
  pushMessage,
  useChatRooms,
  resetRepliedMessage,
  pushTemporaryMessage,
  updateMessageInputData
} from 'src/entities/chat-room'
import { useNotification } from 'src/entities/notification'
import { useSound } from 'src/entities/sound'
import { showModal } from 'src/entities/system'
import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'
import { generateUUIDv4 } from 'src/shared/utils'

import { MessageNotification } from '../ui'

export const useMessageSend = (selectedChatRoom: IChatRoom) => {
  const dispatch = useDispatch()

  const inputRef = useRef<HTMLInputElement>(null)

  const { getNotification, openBrowserNotification } = useNotification()
  const { play } = useSound()
  const { getRoomById, repliedMessageData, messageInputData } = useChatRooms()
  const { sendUserTypingStatus, debouncedChangeTypeStatus } = useContactTyping(selectedChatRoom)
  const { id, username } = useUser()

  const openSendMessageModal = () => {
    dispatch(
      showModal({
        title: 'Send Message',
        modalContentComponentName: 'message-with-bind-data-modal'
      })
    )
  }

  const sendBtnDisabled = !repliedMessageData.id && !messageInputData.body

  const onBlur = () => {
    sendUserTypingStatus(false)
  }

  const setEmoji = (value: string) => {
    const input = inputRef.current
    if (!input) return

    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0

    const newText = messageInputData.body.slice(0, start) + value + ' ' + messageInputData.body.slice(end)

    setMessageBody(newText)

    requestAnimationFrame(() => {
      input.setSelectionRange(start + 2, start + 2)
      input.focus()
    })
  }

  const onTypingMessage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageBody(e.target.value)

    sendUserTypingStatus(true)
    debouncedChangeTypeStatus(false)
  }

  const setImagesHandler = (imagesFiles: FileLoaderValueType) => {
    dispatch(updateMessageInputData({ images: imagesFiles as IImageObject[] }))
    openSendMessageModal()
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

  const onSendMessageFormSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendMessage()
  }

  const sendMessage = () => {
    const messageData: IMessage = {
      authorId: id,
      authorName: username,
      id: '',
      createdAt: String(Date.now()),
      tempId: generateUUIDv4(),
      status: 'sending',
      body: messageInputData.body,
      images: messageInputData.images,
      imageCompression: messageInputData.imageCompression,
      repliedMessage: repliedMessageData
    }

    const payload: IEventSendMessage = {
      roomId: selectedChatRoom.id,
      message: messageData
    }

    socket.emit<SocketActionsType>('send-message', payload)
    dispatch(resetRepliedMessage())
    dispatch(pushTemporaryMessage(payload))
    dispatch(updateMessageInputData({ body: '', images: [] }))
  }

  const setMessageBody = (value: string) => dispatch(updateMessageInputData({ body: value }))

  return {
    monitorMessageDelivered,
    sendMessage,
    setMessage: setMessageBody,
    setEmoji,
    onSendMessageFormSubmitHandler,
    onTypingMessage,
    onBlur,
    setImagesHandler,
    inputRef,
    sendBtnDisabled,
    message: messageInputData.body,
    images: messageInputData.images
  }
}
