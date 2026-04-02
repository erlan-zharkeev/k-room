import './style.scss'

import { CHAT_ROOM_STUB_I18N } from 'src/widgets/chat-room'

import { useContentTabSelect } from 'src/features/content-tab'

import { useSettings, useI18n } from 'src/entities/settings'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { AppText } from 'src/shared/ui'

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
      <AppText align="center" tag="p">
        {t(CHAT_ROOM_STUB_I18N.text)}
      </AppText>
    </div>
  )
}
