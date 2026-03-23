import './style.scss'
import { ReactElement } from 'react'

import { InfoNotification } from 'src/widgets/info-notifications'
import { SelectedChatRoom } from 'src/widgets/selected-chat-room'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

import { useSettings } from 'src/entities/settings'

import type { ContentTabType } from 'src/shared/config'

const CONTENT_COMPONENT_MAP: Record<ContentTabType, ReactElement> = {
  info: <InfoNotification />,
  'chat-rooms': <SelectedChatRoom />,
  calls: <SelectedChatRoom />,
  contacts: <SelectedChatRoom />,
  settings: <SelectedChatRoom />
}

export const Content = () => {
  const { selectedContentTab } = useSettings()

  return <WidgetWrapper name="content">{CONTENT_COMPONENT_MAP[selectedContentTab]}</WidgetWrapper>
}
