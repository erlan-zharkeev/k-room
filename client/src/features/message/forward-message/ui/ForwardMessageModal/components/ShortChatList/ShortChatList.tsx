import './style.scss'
import { useState, useMemo } from 'react'

import { SHORT_CHAT_LIST_I18N, IShortChatListProps } from 'src/features/message/forward-message'

import { useChatRoom } from 'src/entities/chat-room'
import { useI18n } from 'src/entities/settings'

export const ShortChatList = ({ searchString, clickChat }: IShortChatListProps) => {
  const { chatRooms, selectedChatRoom } = useChatRoom()
  const [filteredRooms, setFilteredRooms] = useState(chatRooms)
  const { t } = useI18n()

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
      {filteredRooms.length > 0 && (
        <div className="paragraph-text short-chat-list__subtitle">{t(SHORT_CHAT_LIST_I18N.chooseRoom)}</div>
      )}
      <div className="short-chat-list__container">
        {filteredRooms.map((room) => (
          <button type="button" className="short-chat-list__item" key={room.id} onClick={() => clickChat(room.id)}>
            {/* <AppAvatar
              stubIconName={room.multiple ? 'image-stub' : 'user-stub'}
              shape={room.multiple ? 'square-shape' : 'circle-shape'}
              showBadge={false}
              src={room.avatar}
              ribbon={true}
            /> */}
            <span className="paragraph-text  short-chat-list__name">{room.chatName}</span>
          </button>
        ))}
      </div>
      {filteredRooms.length <= 0 && <div className="paragraph-text ">{t(SHORT_CHAT_LIST_I18N.notFound)}</div>}
    </div>
  )
}
