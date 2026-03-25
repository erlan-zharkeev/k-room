import './style.scss'

import { ChatRoomList, CreateChatRoomBtn } from 'src/features/chat-room'

import { useI18n } from 'src/entities/system'

import { AppHeader } from 'src/shared/ui'

import { CHAT_ROOMS_WIDGET_I18N } from './config'

export const ChatRooms = () => {
  const { t } = useI18n()

  return (
    <div className="chat-rooms">
      <CreateChatRoomBtn />
      <div className="divider" />
      <AppHeader tag="h4">{t(CHAT_ROOMS_WIDGET_I18N.title)}</AppHeader>
      <ChatRoomList />
    </div>
  )
}
