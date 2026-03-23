import { useRef } from 'react'

import {
  IEventSendMessage,
  IMessage,
  SocketActionsType
} from 'common-types'
import { useDispatch } from 'react-redux'

import { useAddMessage } from 'src/features/message'

import { resetRepliedMessage, updateMessageInputData, useSystem } from 'src/entities/system'
import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'
import { FileLoaderValueType } from 'src/shared/config'
import { generateUUIDv4 } from 'src/shared/utils'

export const useMessageSend = () => {
  const dispatch = useDispatch()
  const { addMessage } = useAddMessage()

  const { messageInputData, repliedMessageData } = useSystem()

  const inputBodyRef = useRef<HTMLInputElement>(null)
  const { id, username } = useUser()

  const setBody = (body: string) => {
    dispatch(updateMessageInputData({ body }))
  }

  const setEmoji = (emoji: string) => {
    const el = inputBodyRef.current
    if (!el) return
    if (document.activeElement !== el) el.focus()
    el.setRangeText(emoji + ' ', el.selectionStart ?? 0, el.selectionEnd ?? 0, 'end')
    setBody(el.value)
  }

  const setImages = (imagesFiles: FileLoaderValueType) => {
    dispatch(updateMessageInputData({ images: imagesFiles }))
  }

  const onSendMessageFormSubmitHandler = (roomId: string) => {
    const messageData: IMessage = {
      authorId: id,
      authorName: username,
      id: generateUUIDv4(),
      isSelf: true,
      createdAt: String(Date.now()),
      status: 'sending',
      body: messageInputData?.body ?? '',
      images: messageInputData?.images,
      imageCompression: messageInputData?.imageCompression,
      repliedMessage: repliedMessageData.id ? repliedMessageData : null
    }

    const payload: IEventSendMessage = {
      roomId,
      message: messageData
    }

    socket.emit<SocketActionsType>('send-message', payload)
    addMessage(roomId, messageData)
    dispatch(resetRepliedMessage())
    dispatch(updateMessageInputData({ body: '', images: [] }))
    inputBodyRef.current?.blur()
  }

  return {
    inputBodyRef,
    body: messageInputData.body,
    images: messageInputData.images,
    setBody,
    setEmoji,
    onSendMessageFormSubmitHandler,
    setImages
  }
}
