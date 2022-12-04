import { List } from 'antd'
import useTypedSelector from '../../hooks/useTypedSelector'
import InputMessage from './Components/InputMessage/InputMessage'
import MessageBody from './Components/MessageBody/MessageBody'
import { Message, SocketActions } from './../../../../types'
import RoomHeader from './Components/RoomHeader/RoomHeader'
import { pushTemporaryMessage, updateChatMessage, useSelectedRoom } from '../../store/chatRoomsSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { useEffect, useRef, useState } from 'react'
import scrollToBottom from '../../utils/scrollToBottom'
import { changeAsideTab } from '../../store/systemSlice'
import { socket } from '../../socket/socket'
import { v4 as uuidv4 } from 'uuid'
import useDynamicRefs from 'use-dynamic-refs'

export const ChatRoom = () => {
  const selectedChatRoom = useSelectedRoom()

  const { id, username } = useTypedSelector((state) => state.persist.auth.userData)
  const [getRef, setRef] = useDynamicRefs() as any

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!selectedChatRoom) return
    scrollToBottom()
    const observerCallback = function (entries: any) {
      entries.forEach((entry: any) => {
        if (!entry.isIntersecting) return
        const messageId = entry.target.getAttribute('id')
        socket.emit(SocketActions.CHANGE_MESSAGE_STATUS, { roomId: selectedChatRoom.roomId, messageId, status: 'read' })
      })
    }
    const observer = new IntersectionObserver(observerCallback, { threshold: 1 })

    selectedChatRoom.messages.forEach((message) => {
      if (message.isSelf === true || message.isSelf === undefined) return
      const el = getRef(message.id)
      el.current.setAttribute('id', message.id)
      observer.observe(el.current)
    })
  })

  const sendMessage = (messageText: string) => {
    const roomId = selectedChatRoom?.roomId
    const message: Message = {
      id: uuidv4(),
      status: 'sending',
      authorName: username,
      author: id,
      body: messageText,
      createdAt: String(Date.now())
    }
    socket.emit(SocketActions.SEND_MESSAGE, { roomId, message })
    dispatch(pushTemporaryMessage({ roomId, message }))
  }

  const isMessageSelf = (author: string) => (author === id ? 'message--self' : '')

  return (
    <div className="chat-room">
      <div className="chat-room__wrapper">
        {selectedChatRoom ? (
          <>
            <RoomHeader />
            <div className="chat-room__body">
              <List
                id="message-list"
                itemLayout="horizontal"
                dataSource={selectedChatRoom.messages ?? []}
                locale={{ emptyText: 'There are no messages, write first' }}
                renderItem={(item: Message) => (
                  <List.Item className={isMessageSelf(item.author)} ref={setRef(item.id)}>
                    <MessageBody message={item} />
                  </List.Item>
                )}
              />
            </div>
            <InputMessage sendMessage={sendMessage} />
          </>
        ) : (
          <div className="chat-room__stub">
            <div
              onClick={() => dispatch(changeAsideTab('chatList'))}
              className="paragraph-text paragraph-text--secondary"
            >
              Choose chat room
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatRoom
