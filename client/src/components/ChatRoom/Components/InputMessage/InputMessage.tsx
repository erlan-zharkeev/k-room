import { Form } from 'antd'
import { FormEvent, useState } from 'react'
import { SocketActions } from 'common-types'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'
import EmojiDropDown from '../EmojiDropdown/EmojiDropDown'
import { InputMessageProps } from './@types/InputMessageProps'
import useSelectedRoom from 'src/hooks/useSelectedRoom'
import useDebounce from 'src/hooks/useDebounce'
import UIInput from 'src/components/UI/UIInput/UIInput'
import UIButton from 'src/components/UI/UIButton/UIButton'
import ReplyMessage from './Components/ReplyMessage/ReplyMessage'

const InputMessage = ({ sendMessage, height }: InputMessageProps) => {
  // const { repliedMessageData } = useTypedSelector((state) => state.chatRooms)

  const [message, setMessage] = useState('')
  const { id } = useTypedSelector((state) => state.user.userData)
  const selectedChatRoom = useSelectedRoom()

  const sendUserTypingStatus = (status: boolean) => {
    if (!selectedChatRoom) return
    socket.emit(SocketActions.USER_TYPING, { userIdFrom: id, usersTo: selectedChatRoom.users, status })
  }

  const debouncedInput = useDebounce(sendUserTypingStatus, 2000)

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    sendUserTypingStatus(true)
    debouncedInput(false)
  }
  const setEmoji = (value: string) => setMessage(`${message} ${value} `)

  const send = (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    sendMessage(message)
    setMessage('')
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
        <UIButton iconName="paper-clip" />
        <UIInput onChange={onChange} value={message} onBlur={() => sendUserTypingStatus(false)} />
        <EmojiDropDown setEmoji={setEmoji} />
        <UIButton htmltype="submit" disabled={!message} iconName="send" onClick={send} />
      </Form>
    </div>
  )
}

export default InputMessage
