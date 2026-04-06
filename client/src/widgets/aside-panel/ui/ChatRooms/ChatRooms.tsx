import './style.scss'

import { CHAT_ROOMS_WIDGET_I18N } from 'src/widgets/aside-panel'

import { ChatRoomList, CreateChatRoomBtn } from 'src/features/chat-room'

import { useI18n } from 'src/shared/settings'
import { AppHeader } from 'src/shared/ui'

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
