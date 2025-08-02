import './style.scss'
import { useState, useMemo } from 'react'

import { useChatRooms } from 'src/entities/chat-room'

import { useTypedSelector } from 'src/shared/lib'
import { AppAvatar } from 'src/shared/ui'

import type { IShortChatListProps } from './types'

export const ShortChatList = ({ searchString, clickChat }: IShortChatListProps) => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const [filteredRooms, setFilteredRooms] = useState(chatRooms)
  const { selectedChatRoom } = useChatRooms()

  const filterList = () => {
    const selfFilteredRooms = chatRooms.filter((room) => room.id !== selectedChatRoom?.id)
    const queryFilteredRooms = selfFilteredRooms.filter((room) => {
      const username = room.chatName?.toLowerCase() ?? 'name unknown'
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
            <AppAvatar
              stubIconName={room.multiple ? 'image-stub' : 'user-stub'}
              shape={room.multiple ? 'square-shape' : 'circle-shape'}
              showBadge={false}
              src={room.avatarPath}
              ribbon={true}
            />
            <span className="paragraph-text  short-chat-list__name">{room.chatName}</span>
          </div>
        ))}
      </div>
      {filteredRooms.length <= 0 && <div className="paragraph-text ">Chat rooms not found</div>}
    </div>
  )
}
