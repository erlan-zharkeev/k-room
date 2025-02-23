import './style.scss'
import useDynamicRefs from 'use-dynamic-refs'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { clientConstants } from 'src/client-constants'
import { List } from 'antd'
import { Message, SocketActions, ImageObject, EventChangeMessageStatus } from 'common-types'
import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from 'src/shared/lib'
import { AppDispatch } from 'src/app/store'
import { socket } from 'src/shared/api'
import { RoomHeader, MessageBody, InputMessage } from './elements'
import { scrollToBottom, sendMessage } from 'src/shared/utils'
import { WidgetWrapper } from '../WidgetWrapper/WidgetWrapper'
import { updatedAttachedFilesMessage, useChatRooms } from 'src/entities/chat-room'
import { showModal } from 'src/entities/system'
import { useSettings } from 'src/entities/settings'

export const ChatRoom = () => {
  const { selectedChatRoom } = useChatRooms()

  const haveMessageToReply = Boolean(useTypedSelector((state) => state.chatRooms.repliedMessageData.id))
  const haveAnyChatRoom = Boolean(useTypedSelector((state) => state.chatRooms.chatRooms).length)
  const isSetChatList = useTypedSelector((state) => state.persist.settings.selectedContentElement) === 'chat-list'
  const { id, username } = useTypedSelector((state) => state.user.userData)
  const [getRef, setRef] = useDynamicRefs() as any
  const [inputMessageHeight, setInputMessageHeight] = useState(clientConstants.dimensions.shortInputMessage)
  const [chatRoomPosition, setChatRoomPosition] = useState({ top: 0 })
  const dispatch = useDispatch<AppDispatch>()
  const roomDomEl = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState([] as Array<Message>)
  const { repliedMessageData } = useTypedSelector((state) => state.chatRooms)
  const { updateSetting } = useSettings()

  const observerCallback = (entries: any[]) => {
    entries.forEach((entry: any) => {
      if (!entry.isIntersecting || !selectedChatRoom) return
      const messageId = entry.target.getAttribute('id')
      const messageRead = Boolean(entry.target.querySelector('.message--read'))
      if (messageId.includes('time') || messageRead) return
      const payload: EventChangeMessageStatus = {
        roomId: selectedChatRoom.id,
        messageId,
        status: 'read'
      }
      socket.emit<SocketActions>('change-message-status', payload)
    })
  }

  const observer = new IntersectionObserver(observerCallback, { threshold: 0.5 })

  const setRefToMessages = () => {
    selectedChatRoom?.messages.forEach((message) => {
      /** Use only strict validation without type casting */
      if (message.isSelf ?? message.isSelf === undefined) return
      const el = getRef(message.id)
      if (!el.current) return
      el.current.setAttribute('id', message.id)
      observer.observe(el.current)
    })
  }

  useEffect(() => {
    injectDateToMessages()
    scrollToBottom()
    setTimeout(() => {
      setRefToMessages()
    }, 1500)
  }, [selectedChatRoom])

  useEffect(() => {
    const roomEl = roomDomEl.current
    if (roomEl) {
      const { fullInputMessage, shortInputMessage, chatRoomHeaderHeight } = clientConstants.dimensions
      const inputHeight = haveMessageToReply ? fullInputMessage : shortInputMessage

      setInputMessageHeight(inputHeight)
      const position = {
        top: chatRoomHeaderHeight
      }
      setChatRoomPosition(position)
    }
  }, [haveMessageToReply])

  const uploadImageHandler = ({ message, images }: { message: string; images: Array<ImageObject> }) => {
    dispatch(
      updatedAttachedFilesMessage({
        body: message,
        images,
        imageCompression: false
      })
    )
    dispatch(
      showModal({
        title: 'Send Message',
        modalContentComponentName: 'message-with-bind-data-popup'
      })
    )
  }

  const locationModifier = (author: string): string => {
    if (author === 'system' || author === 'time') return author
    else return author === id ? 'self' : ''
  }

  const injectDateToMessages = () => {
    let lastDate = ''
    const updatedMessagesWithDates: Array<Message> = []
    selectedChatRoom?.messages.forEach((message) => {
      const messageDate = moment(Number(message.createdAt)).format('LL').split(',')[0]
      if (messageDate !== lastDate && message.authorName !== 'system') {
        lastDate = messageDate
        const dateMessage: Message = {
          id: `${uuidv4()}-time`,
          authorName: 'time',
          authorId: 'time',
          body: lastDate,
          status: 'none'
        }
        updatedMessagesWithDates.push(dateMessage)
      }
      updatedMessagesWithDates.push(message)
    })
    setMessages(updatedMessagesWithDates)
  }

  const chooseChatRoomHandler = () => {
    updateSetting('selectedContentElement', { selectedContentElement: 'chat-list' })
  }

  return (
    <div className="chat-room">
      <WidgetWrapper placement="main">
        <div className="chat-room__wrapper" ref={roomDomEl}>
          {selectedChatRoom ? (
            <div>
              <RoomHeader />
              <div
                className="chat-room__body"
                style={{
                  top: `${chatRoomPosition.top}px`
                }}
              >
                <List
                  id="message-list"
                  itemLayout="horizontal"
                  dataSource={messages ?? []}
                  locale={{ emptyText: ' ' }}
                  renderItem={(item: Message) => (
                    <List.Item
                      key={item.id}
                      className={`chat-room__message--${locationModifier(item.authorId)}`}
                      ref={setRef(item.id)}
                    >
                      <MessageBody message={item} isChatMultiple={selectedChatRoom.multiple} />
                    </List.Item>
                  )}
                />
              </div>
              {messages.length === 0 && (
                <div className="chat-room__empty-text paragraph-text paragraph-text--secondary">
                  There are no messages, write first
                </div>
              )}
              <InputMessage
                sendMessage={(message: string) =>
                  sendMessage({
                    authorId: id,
                    roomId: selectedChatRoom?.id,
                    username,
                    messageText: message,
                    repliedMessage: repliedMessageData,
                    dispatch
                  })
                }
                uploadImageHandler={uploadImageHandler}
                height={inputMessageHeight}
              />
            </div>
          ) : (
            <div className={`chat-room__stub ${haveAnyChatRoom && !isSetChatList ? 'pointer' : ''}`}>
              <div onClick={chooseChatRoomHandler} className="paragraph-text paragraph-text--secondary">
                Choose or create chat
              </div>
            </div>
          )}
        </div>
      </WidgetWrapper>
    </div>
  )
}
