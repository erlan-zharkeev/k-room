import './style.scss'
import { ReactElement } from 'react'

import { ContentTabType } from 'common-types'

import { ChatRoom } from 'src/widgets/chat-room'
import { InfoNotification } from 'src/widgets/info-notifications'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

import { useSettings } from 'src/entities/settings'

const CONTENT_COMPONENT_MAP: Record<ContentTabType, ReactElement> = {
  info: <InfoNotification />,
  'chat-rooms': <ChatRoom />,
  calls: <ChatRoom />,
  contacts: <ChatRoom />,
  settings: <ChatRoom />
}

export const Content = () => {
  const { selectedContentTab } = useSettings()

  return <WidgetWrapper name="content">{CONTENT_COMPONENT_MAP[selectedContentTab]}</WidgetWrapper>
}
