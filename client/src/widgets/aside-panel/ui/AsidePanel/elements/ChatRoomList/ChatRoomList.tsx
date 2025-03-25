import './style.scss'
import { Badge, List } from 'antd'
import { AppButton } from 'src/shared/ui'
import { Message, SocketActions, ChatRoom, EventSaveContact } from 'common-types'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from 'src/shared/lib'
import { getChatName } from 'src/shared/utils'
import { AppDispatch } from 'src/app/store'
import { socket } from 'src/shared/api'
import { showModal } from 'src/entities/system'
import { useSettings } from 'src/entities/settings'
import { ChatRoomAvatar } from 'src/entities/chat-room'

export const ChatRoomList = () => {
  const { updateSetting } = useSettings()
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { contacts } = useTypedSelector((state) => state.contacts)
  const { selectedChatRoomId } = useTypedSelector((state) => state.persist.settings)

  const dispatch = useDispatch<AppDispatch>()

  const getLastMessage = (messages: Array<Message>): string => {
    if (!messages) return ''
    return messages[messages.length - 1]?.body ?? ''
  }

  const setChat = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    e.stopPropagation()
    updateSetting('selectedChatRoomId', { selectChatRoomId: id })
  }

  const addUser = async (e: React.MouseEvent<HTMLElement, MouseEvent>, interlocutorId: string) => {
    e.stopPropagation()
    const payload: EventSaveContact = { interlocutorId }
    socket.emit<SocketActions>('save-contact', payload)
  }

  const unreadMessages = (room: ChatRoom) =>
    room.messages.filter((message) => !message.isSelf && message.status === 'delivered').length

  const getFirstUserIdInChatRoom = (chatRoom: ChatRoom) => chatRoom.users[0].id

  const showAddUserButton = (chatRoom: ChatRoom) => {
    const userId = getFirstUserIdInChatRoom(chatRoom)
    const hasUserInContacts = !!contacts.find((element) => element.id === userId)
    const isChatMultiple = chatRoom.multiple || chatRoom.users.length !== 1
    return !hasUserInContacts && !isChatMultiple
  }

  const createMultipleChat = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    dispatch(
      showModal({
        title: 'Create New Chat Room',
        modalContentComponentName: 'create-multiple-chat-popup'
      })
    )
  }

  const resetChatRoomId = () => {
    updateSetting('selectedChatRoomId', { selectChatRoomId: '' })
  }

  return (
    <div className="chat-room-list" onClick={resetChatRoomId}>
      <div className="chat-room-list__create-chat">
        <AppButton text="Create group" iconName="plus" border="common-border" fill onClick={createMultipleChat} />
        <div className="divider" />
      </div>
      <div className="chat-room-list__body">
        <List
          itemLayout="horizontal"
          dataSource={chatRooms}
          locale={{
            emptyText: <div className="paragraph-text ">There are no chats yet</div>
          }}
          renderItem={(chatRoom) => (
            <List.Item
              onClick={(e) => setChat(e, chatRoom.id)}
              key={chatRoom.id}
              className={selectedChatRoomId === chatRoom.id ? 'active' : ''}
            >
              <List.Item.Meta
                avatar={<ChatRoomAvatar room={chatRoom} />}
                title={<span>{getChatName(chatRoom)}</span>}
                description={getLastMessage(chatRoom.messages)}
              />
              <div className="chat-room-list__controls">
                <Badge
                  color="var(--accent)"
                  count={Boolean(unreadMessages(chatRoom)) ? unreadMessages(chatRoom) : 0}
                  offset={[-20, 0]}
                  className="chat-room-list__badge"
                >
                  {' '}
                </Badge>
                {showAddUserButton(chatRoom) && (
                  <AppButton
                    prefixIconName="plus"
                    tooltip="Add User"
                    onClick={(e) => addUser(e, getFirstUserIdInChatRoom(chatRoom))}
                  />
                )}
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}
