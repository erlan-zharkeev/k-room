import { Badge, List } from 'antd'
import { SocketActions, ChatRoom, Message } from 'common-types'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'
import { AppDispatch } from 'src/store'
import { selectChatRoom } from 'src/store/settingsSlice'
import { showModal } from 'src/store/systemSlice'
import UIAvatar from 'ui/UIAvatar'
import UIButton from 'ui/UIButton'

export const ChatRoomList = () => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { contacts } = useTypedSelector((state) => state.contacts)
  const { id } = useTypedSelector((state) => state.user.userData)
  const { selectedChatRoomId } = useTypedSelector((state) => state.persist.settings)

  const dispatch = useDispatch<AppDispatch>()

  const getLastMessage = (messages: Array<Message>): string => {
    if (!messages) return ''
    return messages[messages.length - 1]?.body ?? ''
  }

  const setChat = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    e.stopPropagation()
    dispatch(selectChatRoom(id))
  }

  const addUser = async (e: React.MouseEvent<HTMLElement, MouseEvent>, interlocutorId: string) => {
    e.stopPropagation()
    socket.emit(SocketActions.SAVE_CONTACT, { userId: id, interlocutorId })
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

  const createMultipleChat = () => {
    dispatch(showModal({ title: 'Create New Chat Room', modalContentComponentName: 'CreateMultipleChatPopup' }))
  }

  return (
    <div className="chat-room-list" onClick={() => dispatch(selectChatRoom(''))}>
      <div className="chat-room-list__create-chat">
        <UIButton text="Create group" iconName="plus" border="border-default" fill={true} onClick={createMultipleChat} />
        <div className="divider" />
      </div>

      <div className="chat-room-list__body">
        <List
          itemLayout="horizontal"
          dataSource={chatRooms}
          locale={{
            emptyText: <div className="paragraph-text paragraph-text--secondary">There are no chats yet</div>
          }}
          renderItem={(chatRoom) => (
            <List.Item
              onClick={(e) => setChat(e, chatRoom.roomId)}
              key={chatRoom.roomId}
              className={selectedChatRoomId === chatRoom.roomId ? 'active' : ''}
            >
              <List.Item.Meta
                avatar={<UIAvatar online={chatRoom.hasOnline} src={chatRoom.avatar} />}
                title={<span>{chatRoom.chatName}</span>}
                description={getLastMessage(chatRoom.messages)}
              />
              <div className="chat-room-list__controls">
                {Boolean(unreadMessages(chatRoom)) && (
                  <Badge className="chat-room-list__unread-messages" count={unreadMessages(chatRoom)} />
                )}
                {showAddUserButton(chatRoom) && (
                  <UIButton
                    iconName="plus"
                    size="small"
                    onClick={async (e) => await addUser(e, getFirstUserIdInChatRoom(chatRoom))}
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

export default ChatRoomList
