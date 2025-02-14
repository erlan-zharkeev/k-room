import { useState, useMemo } from 'react'
import { UIAvatar } from 'src/components'
import { useTypedSelector, useSelectedRoom } from 'src/hooks'

export interface ShortChatListProps {
  searchString: string
  clickChat: (userId: string) => void
}

export const ShortChatList = ({ searchString, clickChat }: ShortChatListProps) => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const [filteredRooms, setFilteredRooms] = useState(chatRooms)
  const selectedChatRoom = useSelectedRoom()
  const filterList = () => {
    const selfFilteredRooms = chatRooms.filter((room) => room.id !== selectedChatRoom?.id)
    const queryFilteredRooms = selfFilteredRooms.filter((room) => {
      const username = room.chatName.toLowerCase()
      const searchParams = searchString.toLowerCase()
      return searchParams === '' || username.includes(searchParams)
    })
    setFilteredRooms(queryFilteredRooms)
  }

  useMemo(() => {
    filterList()
  }, [searchString, chatRooms, selectedChatRoom])

  return (
    <div className="short-chat-list">
      {filteredRooms.length > 0 && <div className="paragraph-text short-chat-list__subtitle">Choose room</div>}
      <div className="short-chat-list__container">
        {filteredRooms.map((room) => (
          <div className="short-chat-list__item" key={room.id} onClick={() => clickChat(room.id)}>
            <UIAvatar
              stubIconName={room.multiple ? 'image-stub' : 'user-stub'}
              shape={room.multiple ? 'square' : 'round'}
              showBadge={false}
              src={room.avatarPath}
              ribbon={true}
            />
            <span className="paragraph-text paragraph-text--secondary short-chat-list__name">{room.chatName}</span>
          </div>
        ))}
      </div>
      {filteredRooms.length <= 0 && (
        <div className="paragraph-text paragraph-text--secondary">Chat rooms not found</div>
      )}
    </div>
  )
}
