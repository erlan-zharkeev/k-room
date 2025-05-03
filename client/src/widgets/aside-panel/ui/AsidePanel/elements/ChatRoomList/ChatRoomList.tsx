import './style.scss'
import { Badge, List } from 'antd'
import { IMessage, SocketActionsType, IChatRoom, IEventSaveContact } from 'common-types'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { useRoomSelect } from 'src/features/room'

import { ChatRoomAvatar } from 'src/entities/chat-room'
import { showModal } from 'src/entities/system'

import { socket } from 'src/shared/api'
import { useTypedSelector } from 'src/shared/lib'
import { AppButton } from 'src/shared/ui'
import { getChatName } from 'src/shared/utils'

export const ChatRoomList = () => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { contacts } = useTypedSelector((state) => state.contacts)
  const { selectedChatRoomId } = useTypedSelector((state) => state.persist.settings)

  const dispatch = useDispatch<AppDispatch>()

  const getLastMessage = (messages: IMessage[]): string => {
    if (!messages) return ''
    return messages[messages.length - 1]?.body ?? ''
  }

  const { selectRoomById, resetRoomSelection } = useRoomSelect()

  const setChat = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    e.stopPropagation()
    selectRoomById(id)
  }

  const addUser = async (interlocutorId: string) => {
    const payload: IEventSaveContact = { interlocutorId }
    socket.emit<SocketActionsType>('save-contact', payload)
  }

  const unreadMessages = (room: IChatRoom) =>
    room.messages.filter((message) => !message.isSelf && message.status === 'delivered').length

  const getFirstUserIdInChatRoom = (chatRoom: IChatRoom) => chatRoom.users[0].id

  const showAddUserButton = (chatRoom: IChatRoom) => {
    const userId = getFirstUserIdInChatRoom(chatRoom)
    const hasUserInContacts = !!contacts.find((element) => element.id === userId)
    const isChatMultiple = chatRoom.multiple || chatRoom.users.length !== 1
    return !hasUserInContacts && !isChatMultiple
  }

  const createMultipleChat = () => {
    dispatch(
      showModal({
        title: 'Create New Chat Room',
        modalContentComponentName: 'create-multiple-chat-popup'
      })
    )
  }

  return (
    <div className="chat-room-list" onClick={resetRoomSelection}>
      <div className="chat-room-list__create-chat">
        <AppButton text="Create group" prefixIconName="plus" borderless onClick={createMultipleChat} />
        <div className="divider" />
      </div>
      <div className="chat-room-list__body">
        <List
          itemLayout="horizontal"
          dataSource={chatRooms}
          locale={{
            emptyText: <div className="paragraph-text">There are no chats yet</div>
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
                  count={unreadMessages(chatRoom) ? unreadMessages(chatRoom) : 0}
                  offset={[-20, 0]}
                  className="chat-room-list__badge"
                >
                  {' '}
                </Badge>
                {showAddUserButton(chatRoom) && (
                  <AppButton
                    prefixIconName="plus"
                    onClick={() => {
                      addUser(getFirstUserIdInChatRoom(chatRoom))
                    }}
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
