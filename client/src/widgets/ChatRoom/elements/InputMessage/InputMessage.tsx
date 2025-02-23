import './style.scss'
import { Form } from 'antd'
import { SocketActions, ImageObject, EventUserTyping } from 'common-types'
import { useState } from 'react'
import { useTypedSelector } from 'src/shared/lib'
import { socket } from 'src/shared/api'
import { ReplyMessage, EmojiDropdown } from './elements'
import { ImageLoader, Input, Button } from 'src/shared/ui'
import { useChatRooms } from 'src/entities/chat-room'
import { useDebounce } from 'src/shared/lib/hooks'

export interface InputMessageProps {
  sendMessage: (message: string) => void
  uploadImageHandler: (payload: { message: string; images: Array<ImageObject> }) => void
  height: number
}

export const InputMessage = ({ sendMessage, uploadImageHandler, height }: InputMessageProps) => {
  const [message, setMessage] = useState('')
  const { username } = useTypedSelector((state) => state.user.userData)
  const { repliedMessageData } = useTypedSelector((state) => state.chatRooms)
  const haveRepliedMessage = () => Boolean(repliedMessageData.id)
  const { selectedChatRoom } = useChatRooms()

  const sendUserTypingStatus = (status: boolean) => {
    if (!selectedChatRoom) return
    const payload: EventUserTyping = {
      authorName: username,
      usersTo: selectedChatRoom.users,
      status
    }
    socket.emit<SocketActions>('user-typing', payload)
  }

  const debouncedInput = useDebounce(sendUserTypingStatus, 2000)

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    sendUserTypingStatus(true)
    debouncedInput(false)
  }
  const setEmoji = (value: string) => setMessage(`${message} ${value} `)

  const send = () => {
    sendMessage(message)
    setMessage('')
  }

  const setImagesHandler = (images: Array<ImageObject>) => {
    uploadImageHandler({ message, images })
  }

  const isButtonDisabled = !haveRepliedMessage() && !message

  return (
    <div
      className="input-message"
      style={{
        height: `${height}px`
      }}
    >
      <ReplyMessage />
      <Form onFinish={send}>
        <ImageLoader multiple={true} setImages={setImagesHandler} />
        <Input onChange={onChange} value={message} onBlur={() => sendUserTypingStatus(false)} />
        <EmojiDropdown setEmoji={setEmoji} />
        <Button htmltype="submit" disabled={isButtonDisabled} iconName="send" onClick={send} />
      </Form>
    </div>
  )
}
