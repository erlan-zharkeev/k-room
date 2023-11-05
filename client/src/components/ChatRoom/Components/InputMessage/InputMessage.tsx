import { Form } from 'antd'
import { useState } from 'react'
import { SocketActions, SocketActionsPayload, ImageObject } from 'common-types'
import useTypedSelector from 'src/hooks/useTypedSelector'

import EmojiDropDown from '../EmojiDropdown/EmojiDropDown'
import { InputMessageProps } from './@types/InputMessageProps'
import useSelectedRoom from 'src/hooks/useSelectedRoom'
import useDebounce from 'src/hooks/useDebounce'
import ReplyMessage from './Components/ReplyMessage/ReplyMessage'

import { UIImageLoader, UIInput, UIButton } from 'src/components/UI'
import { $socket } from 'src/services/$socket'

const InputMessage = ({ sendMessage, uploadImageHandler, height }: InputMessageProps) => {
  const [message, setMessage] = useState('')
  const { username, id } = useTypedSelector((state) => state.user.userData)
  const selectedChatRoom = useSelectedRoom()
  const { repliedMessageData } = useTypedSelector((state) => state.chatRooms)
  const haveRepliedMessage = () => Boolean(repliedMessageData.id)

  const sendUserTypingStatus = (status: boolean) => {
    if (!selectedChatRoom) return
    const payload: SocketActionsPayload['userTyping'] = {
      authorName: username,
      authorId: id,
      usersTo: selectedChatRoom.users,
      status
    }
    $socket.emit(SocketActions.USER_TYPING, payload)
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

  const isButtonDisabled = () => {
    return !haveRepliedMessage() && !message
  }

  return (
    <div
      className="input-message"
      style={{
        height: `${height}px`
      }}
    >
      <ReplyMessage />
      <Form onFinish={send}>
        <UIImageLoader multiple={true} setImages={setImagesHandler} />
        <UIInput onChange={onChange} value={message} onBlur={() => sendUserTypingStatus(false)} />
        <EmojiDropDown setEmoji={setEmoji} />
        <UIButton htmltype="submit" disabled={isButtonDisabled()} iconName="send" onClick={send} />
      </Form>
    </div>
  )
}

export default InputMessage
