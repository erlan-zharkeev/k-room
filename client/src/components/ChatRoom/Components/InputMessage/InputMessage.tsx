import { Form } from 'antd'
import { FormEvent, useState } from 'react'
import { SocketActions, SocketActionsPayload } from 'common-types'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'
import EmojiDropDown from '../EmojiDropdown/EmojiDropDown'
import { InputMessageProps } from './@types/InputMessageProps'
import useSelectedRoom from 'src/hooks/useSelectedRoom'
import useDebounce from 'src/hooks/useDebounce'
import ReplyMessage from './Components/ReplyMessage/ReplyMessage'
import { ImageObject } from 'common-types'
import { UIFileLoader, UIInput, UIButton } from 'src/components/UI'

const InputMessage = ({ sendMessage, uploadFileHandler, height }: InputMessageProps) => {
  const [message, setMessage] = useState('')
  const { id } = useTypedSelector((state) => state.user.userData)
  const selectedChatRoom = useSelectedRoom()

  const sendUserTypingStatus = (status: boolean) => {
    if (!selectedChatRoom) return
    const payload: SocketActionsPayload['user-typing'] = {
      userIdFrom: id,
      usersTo: selectedChatRoom.users,
      status
    }
    socket.emit(SocketActions['user-typing'], payload)
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

  const setImagesHandler = (files: Array<ImageObject>) => {
    uploadFileHandler({ message, files })
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
        <UIFileLoader multiple={true} setImages={setImagesHandler} />
        <UIInput onChange={onChange} value={message} onBlur={() => sendUserTypingStatus(false)} />
        <EmojiDropDown setEmoji={setEmoji} />
        <UIButton htmltype="submit" disabled={!message} iconName="send" onClick={send} />
      </Form>
    </div>
  )
}

export default InputMessage
