import { useEffect, useState } from 'react'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { ShortChatListProps } from './@types'
import { UIAvatar } from 'src/components/UI'
import useSelectedRoom from 'src/hooks/useSelectedRoom'

const ShortChatList = ({ searchString, clickChat }: ShortChatListProps) => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const [filteredRooms, setFilteredRooms] = useState(chatRooms)
  const selectedChatRoom = useSelectedRoom()

  useEffect(() => {
    const updatedContacts = chatRooms
      .filter((room) => !room.blocked)
      .filter((room) => room.id !== selectedChatRoom?.id)
      .filter((room) => {
        const username = room.chatName.toLowerCase()
        const searchParams = searchString.toLowerCase()
        const match = username.indexOf(searchParams) > -1
        if (match) return room
      })
    setFilteredRooms(updatedContacts)
  }, [searchString])

  return (
    <div className="short-chat-list">
      {filteredRooms.length > 0 && <div className="paragraph-text">Choose room</div>}
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
      {filteredRooms.length <= 0 && (
        <div className="paragraph-text paragraph-text--secondary">Chat rooms not found</div>
      )}
    </div>
  )
}

export default ShortChatList
