import './style.scss'
import { Form } from 'antd'
import { SocketActionsType, IImageObject, IEventUserTyping } from 'common-types'
import { useState } from 'react'
import { useTypedSelector } from 'src/shared/lib'
import { socket } from 'src/shared/api'
import { ReplyMessage, EmojiDropdown } from './elements'
import { AppImageLoader, AppButton, AppInput } from 'src/shared/ui'
import { useChatRooms } from 'src/entities/chat-room'
import { useDebounce } from 'src/shared/lib/hooks'

export interface InputMessageProps {
  sendMessage: (message: string) => void
  uploadImageHandler: (payload: { message: string; images: IImageObject[] }) => void
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
    const payload: IEventUserTyping = {
      authorName: username,
      usersTo: selectedChatRoom.users,
      status
    }
    socket.emit<SocketActionsType>('user-typing', payload)
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

  const setImagesHandler = (images: IImageObject[]) => {
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
        <AppImageLoader multiple={true} setImages={setImagesHandler} />
        <AppInput name="message" onChange={onChange} value={message} onBlur={() => sendUserTypingStatus(false)} />
        <EmojiDropdown setEmoji={setEmoji} />
        <AppButton htmltype="submit" disabled={isButtonDisabled} prefixIconName="send" onClick={send} borderless />
      </Form>
    </div>
  )
}
