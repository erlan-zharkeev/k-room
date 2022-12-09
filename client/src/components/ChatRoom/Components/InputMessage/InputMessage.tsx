import { Button, Form, Input } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { FormEvent, useCallback, useState } from 'react'
import EmojiDropDown from '../EmojiDropdown/EmojiDropDown'
import InputMessageProps from './@types/InputMessageProps'
import { socket } from '../../../../socket/socket'
import { SocketActions } from './../../../../../../types'
import _debounce from 'lodash/debounce'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import { useSelectedRoom } from '../../../../store/chatRoomsSlice'

export const InputMessage = ({ sendMessage }: InputMessageProps) => {
  const [message, setMessage] = useState('')
  const { id } = useTypedSelector((state) => state.auth.userData)
  const selectedChatRoom = useSelectedRoom()

  const sendUserTypingStatus = (status: boolean) =>
    socket.emit(SocketActions.USER_TYPING, { userIdFrom: id, usersTo: selectedChatRoom.users, status })

  const debouncedInput = useCallback(_debounce(sendUserTypingStatus, 2000), [])

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
