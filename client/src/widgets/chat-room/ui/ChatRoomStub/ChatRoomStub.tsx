import './style.scss'

import { useContentTabSelect } from 'src/features/content-tab'

import { useSettings } from 'src/entities/settings'

import { FChatRoomType } from 'src/shared/config'
import { AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

export const ChatRoomStub = ({ room }: { room: FChatRoomType | undefined }) => {
  if (room) return null

  const { selectContentTab } = useContentTabSelect()
  const { selectedContentTab } = useSettings()

  const className = createClassNameWithModifiers({
    rootClass: 'chat-room-stub',
    modifiers: [selectedContentTab !== 'chat-rooms' && 'pointer']
  })

  return (
    <div className={className} onClick={() => selectContentTab('chat-rooms')}>
      <AppText> Choose or create chat</AppText>
    </div>
  )
}
