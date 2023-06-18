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
import UIFileLoader from 'src/components/UI/UIFileLoader/UIFileLoader'
import { ImageObject } from 'src/components/UI/UIFileLoader/@types'

const InputMessage = ({ sendMessage, uploadFileHandler, height }: InputMessageProps) => {
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
