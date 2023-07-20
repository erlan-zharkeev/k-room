import { List } from 'antd'
import { useDispatch } from 'react-redux'
import useDynamicRefs from 'use-dynamic-refs'
import { SocketActions, Message, SocketActionsPayload, MessageStatus, Author, AsideBarButtonName } from 'common-types'
import useTypedSelector from 'src/hooks/useTypedSelector'
import InputMessage from './Components/InputMessage/InputMessage'
import MessageBody from './Components/MessageBody/MessageBody'
import RoomHeader from './Components/RoomHeader/RoomHeader'
import { useEffect, useRef, useState } from 'react'
import { socket } from 'src/socket/socket'
import { AppDispatch } from 'src/store'
import { scrollToBottom } from 'src/utils/scrollToBottom'
import { updatedAttachedFilesMessage } from 'src/store/roomsSlice'
import useSelectedRoom from 'src/hooks/useSelectedRoom'
import { changeAsideTab } from 'src/store/settingsSlice'
import constants from 'src/constants'
import Informer from '../Common/Informer/Informer'
import { ImageObject } from 'common-types'
import { showModal } from 'src/store/systemSlice'
import { sendMessage } from 'src/utils/sendMessage'
import { WidgetLoader } from '../Common/WidgetLoader/WidgetLoader'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { ModalContentComponentName } from '../Common/Popup/@types'

const ChatRoom = () => {
  const selectedChatRoom = useSelectedRoom()
  const haveMessageToReply = Boolean(useTypedSelector((state) => state.chatRooms.repliedMessageData.id))
  const haveAnyChatRoom = Boolean(useTypedSelector((state) => state.chatRooms.chatRooms).length)
  const isSetChatList = useTypedSelector((state) => state.persist.settings.asideTab) === AsideBarButtonName.chatList
  const { id, username } = useTypedSelector((state) => state.user.userData)
  const [getRef, setRef] = useDynamicRefs() as any
  const [inputMessageHeight, setInputMessageHeight] = useState(constants.dimensions.shortInputMessage)
  const [chatRoomPosition, setChatRoomPosition] = useState({ top: 0, height: 0 })
  const dispatch = useDispatch<AppDispatch>()
  const roomDomEl = useRef<HTMLDivElement>(null)
  const [showWidgetLoader, setShowWidgetLoader] = useState(true)
  const { isLoading } = useTypedSelector((state) => state.chatRooms)
  const [messages, setMessages] = useState([] as Array<Message>)
  const { repliedMessageData } = useTypedSelector((state) => state.chatRooms)

  const observerCallback = (entries: any) => {
    entries.forEach((entry: any) => {
      if (!entry.isIntersecting || !selectedChatRoom) return
      const messageId = entry.target.getAttribute('id')
      const messageRead = Boolean(entry.target.querySelector('.message--read'))
      if (messageId.includes(Author.time) || messageRead) return
      const payload: SocketActionsPayload['changeMessageStatus'] = {
        roomId: selectedChatRoom.id,
        messageId,
        status: MessageStatus.read,
        userId: id
      }
      socket.emit(SocketActions.CHANGE_MESSAGE_STATUS, payload)
    })
  }

  const observer = new IntersectionObserver(observerCallback, { threshold: 0.5 })

  const setRefToMessages = () => {
    selectedChatRoom?.messages.forEach((message) => {
      /** Use only strict validation without type casting */
      if (message.isSelf ?? message.isSelf === undefined) return
      const el = getRef(message.id)
      if (!el) return
      el.current.setAttribute('id', message.id)
      observer.observe(el.current)
    })
  }

  useEffect(() => {
    injectDateToMessages()
    scrollToBottom()
    setTimeout(() => {
      setRefToMessages()
    }, constants.commonTimeoutDuration)
  }, [selectedChatRoom, showWidgetLoader])

  useEffect(() => {
    const roomEl = roomDomEl.current
    if (roomEl) {
      const { fullInputMessage, shortInputMessage, chatRoomHeaderHeight } = constants.dimensions
      const inputHeight = haveMessageToReply ? fullInputMessage : shortInputMessage

      setInputMessageHeight(inputHeight)
      const chatRoomBodyHeight = roomEl.offsetHeight - chatRoomHeaderHeight - inputHeight
      const position = {
        top: chatRoomHeaderHeight,
        height: chatRoomBodyHeight
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
        modalContentComponentName: ModalContentComponentName.messageWithBindDataPopup
      })
    )
  }

  const locationModifier = (author: string): string => {
    if (author === Author.system || author === Author.time) return author
    else return author === id ? 'self' : ''
  }

  useEffect(() => {
    setTimeout(() => {
      setShowWidgetLoader(!isLoading)
    }, constants.chatRoomLoaderMinDuration)
  })

  const injectDateToMessages = () => {
    let lastDate = ''
    const updatedMessagesWithDates: Array<Message> = []
    selectedChatRoom?.messages.forEach((message) => {
      const messageDate = moment(Number(message.createdAt)).format('LL').split(',')[0]
      if (messageDate !== lastDate) {
        lastDate = messageDate
        const dateMessage: Message = {
          id: `${uuidv4()}-time`,
          authorName: Author.time,
          authorId: Author.time,
          body: lastDate,
          status: MessageStatus.none
        }
        updatedMessagesWithDates.push(dateMessage)
      }
      updatedMessagesWithDates.push(message)
    })
    setMessages(updatedMessagesWithDates)
  }

  return (
    <div className="chat-room">
      <WidgetLoader hide={!showWidgetLoader} />
      <div className="chat-room__wrapper" ref={roomDomEl}>
        {selectedChatRoom ? (
          <div>
            <RoomHeader />
            <div
              className="chat-room__body"
              style={{
                top: `${chatRoomPosition.top}px`,
                height: `${chatRoomPosition.height}px`
              }}
            >
              <List
                id="message-list"
                itemLayout="horizontal"
                dataSource={messages ?? []}
                locale={{ emptyText: ' ' }}
                renderItem={(item: Message) => (
                  <List.Item className={`chat-room__message--${locationModifier(item.authorId)}`} ref={setRef(item.id)}>
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
            {selectedChatRoom.blocked ? (
              <Informer type="warn" text="You need to wait for a response from the interlocutor to start a dialogue." />
            ) : (
              <InputMessage
                sendMessage={(message) =>
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
            )}
          </div>
        ) : (
          <div className={`chat-room__stub ${haveAnyChatRoom && !isSetChatList ? 'pointer' : ''}`}>
            <div
              onClick={() => dispatch(changeAsideTab(AsideBarButtonName.chatList))}
              className="paragraph-text paragraph-text--secondary"
            >
              Choose or create chat
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatRoom
