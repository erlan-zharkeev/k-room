import './style.scss'

import { CHAT_ROOM_STUB_I18N } from 'src/widgets/chat-room/ui/ChatRoomStub/config'

import { useContentTabSelect } from 'src/features/content-tab'

import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/system'

import { AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

export const ChatRoomStub = () => {
  const { selectContentTab } = useContentTabSelect()
  const { selectedContentTab } = useSettings()
  const { t } = useI18n()

  const className = createClassNameWithModifiers({
    rootClass: 'chat-room-stub',
    modifiers: [selectedContentTab !== 'chat-rooms' && 'pointer']
  })

  return (
    <div className={className} onClick={() => selectContentTab('chat-rooms')}>
      <AppText>{t(CHAT_ROOM_STUB_I18N.text)}</AppText>
    </div>
  )
}
