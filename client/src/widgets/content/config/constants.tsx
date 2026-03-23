import type { ReactElement } from 'react'

import { ChatRoom } from 'src/widgets/chat-room'
import { InfoNotification } from 'src/widgets/info-notifications'

import type { ContentTabType } from 'src/shared/config'

export const CONTENT_COMPONENT_MAP: Record<ContentTabType, ReactElement> = {
  info: <InfoNotification />,
  'chat-rooms': <ChatRoom />,
  calls: <ChatRoom />,
  contacts: <ChatRoom />,
  settings: <ChatRoom />
}
