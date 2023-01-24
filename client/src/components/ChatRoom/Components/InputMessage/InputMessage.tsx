import { Button, Form, Input } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { FormEvent, useState } from 'react'
import { SocketActions } from 'common-types'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'
import EmojiDropDown from '../EmojiDropdown/EmojiDropDown'
import InputMessageProps from './@types/InputMessageProps'
import useSelectedRoom from 'src/hooks/useSelectedRoom'
import useDebounce from 'src/hooks/useDebounce'

export const InputMessage = ({ sendMessage }: InputMessageProps) => {
  const [message, setMessage] = useState('')
  const { id } = useTypedSelector((state) => state.user.userData)
  const selectedChatRoom = useSelectedRoom()

  const sendUserTypingStatus = (status: boolean) =>
    socket.emit(SocketActions.USER_TYPING, { userIdFrom: id, usersTo: selectedChatRoom.users, status })

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
    <div className="input-message">
      <Form onFinish={send}>
        <Input onChange={onChange} value={message} onBlur={() => sendUserTypingStatus(false)} />
        <EmojiDropDown setEmoji={setEmoji} />
        <Button
          ghost
          type="primary"
          htmlType="submit"
          disabled={!message}
          icon={<SendOutlined />}
          onClick={send}
        ></Button>
      </Form>
    </div>
  )
}

export default InputMessage
