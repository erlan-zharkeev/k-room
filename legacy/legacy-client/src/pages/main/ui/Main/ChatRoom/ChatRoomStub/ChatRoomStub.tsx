import './style.scss'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { useContentTabSelect, useSettings, useI18n } from 'src/shared/preferences'
import { AppText } from 'src/shared/ui'

import { CHAT_ROOM_STUB_I18N } from './i18n.ts'

export const ChatRoomStub = () => {
  const { selectContentTab } = useContentTabSelect()
  const { selectedContentTab } = useSettings()
  const { t } = useI18n()

  const className = createClassNameWithModifiers({
    rootClass: 'chat-room-stub',
    modifiers: [selectedContentTab !== 'chat-rooms' && 'pointer']
  })

  return (
    <button type="button" className={className} onClick={() => selectContentTab('chat-rooms')}>
      <AppText align="center" tag="p">
        {t(CHAT_ROOM_STUB_I18N.text)}
      </AppText>
    </button>
  )
}
