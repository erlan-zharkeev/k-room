import { useEffect, useState } from 'react'
import UIAvatar from 'src/components/UI/UIAvatar'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { ShortChatListProps } from './@types'

const ShortChatList = ({ searchString, clickChat }: ShortChatListProps) => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const [filteredRooms, setFilteredRooms] = useState(chatRooms)

  useEffect(() => {
    const updatedContacts = chatRooms.filter((room) => {
      const username = room.chatName.toLowerCase()
      const searchParams = searchString.toLowerCase()
      const match = username.indexOf(searchParams) > -1
      if (match) return room
    })
    setFilteredRooms(updatedContacts)
  }, [searchString])

  return (
    <div className="short-contacts-list">
      {filteredRooms.map((room) => (
        <div className="short-contacts-list__item" key={room.roomId} onClick={() => clickChat(room.roomId)}>
          <UIAvatar showBadge={false} src={room.avatar} />
          <span className="paragraph-text paragraph-text--secondary short-contacts-list__name">{room.chatName}</span>
        </div>
      ))}
      {filteredRooms.length <= 0 && (
        <div className="paragraph-text paragraph-text--secondary">There are no contacts yet</div>
      )}
    </div>
  )
}

export default ShortChatList
