import './style.scss'

import { ReactElement } from 'react'
import { useSocketConnectionMonitor } from 'src/shared/api'
import { ContentTabType } from 'src/shared/config'
import { useSettings } from 'src/shared/preferences'
import { useViewport } from 'src/shared/system'

import { AsideBar } from './AsideBar/AsideBar'
import { AsidePanel } from './AsidePanel/AsidePanel/AsidePanel'
import { BottomBar } from './BottomBar/BottomBar'
import { ChatRoom } from './ChatRoom/ChatRoom/ChatRoom'
import { ConnectionStatusInfo } from './ConnectionStatusInfo/ConnectionStatusInfo'
import { Content } from './Content/Content'
import { InfoNotification } from './InfoNotifications/InfoNotifications'
import { TopBar } from './TopBar/TopBar/TopBar'
import { WorkspaceLayout } from './WorkspaceLayout/WorkspaceLayout/WorkspaceLayout'
import { useAudioContextNotification } from '../../model/use-audio-context-notification'
import { useChatRoomUpdateMonitor } from '../../model/use-chat-room-update-monitor'
import { useContactUpdateMonitor } from '../../model/use-contact-update-monitor'
import { useInfoNotificationUpdateMonitor } from '../../model/use-info-notification-update-monitor'
import { useLoadRoomMessages } from '../../model/use-load-room-messages'
import { useMessageUpdateMonitor } from '../../model/use-message-update-monitor'
import { useNotificationPermission } from '../../model/use-notification-permission'
import { useUserInteractionMonitor } from '../../model/use-user-interaction-monitor'

export const Main = () => {
  const { greaterOrEqualTablet, lessThanTablet } = useViewport()
  const { selectedContentTab } = useSettings()

  const contentByTab: Record<ContentTabType, ReactElement> = {
    info: <InfoNotification />,
    'chat-rooms': <ChatRoom />,
    calls: <ChatRoom />,
    contacts: <ChatRoom />,
    settings: <ChatRoom />
  }

  useSocketConnectionMonitor()
  useContactUpdateMonitor()
  useMessageUpdateMonitor()
  useLoadRoomMessages()
  useInfoNotificationUpdateMonitor()
  useChatRoomUpdateMonitor()
  // useCallDataUpdateMonitor()
  useUserInteractionMonitor()
  useAudioContextNotification()
  useNotificationPermission()

  return (
    <>
      <div className="main">
        <div className="main__wrapper">
          {greaterOrEqualTablet && <AsideBar />}
          <div className="main__right-side">
            {/* <CallStatusBar /> */}
            <TopBar>
              <ConnectionStatusInfo />
            </TopBar>
            <WorkspaceLayout
              asidePanel={<AsidePanel />}
              content={<Content>{contentByTab[selectedContentTab]}</Content>}
            />
            {lessThanTablet && <BottomBar />}
          </div>
        </div>
      </div>
      {/* <CallModal /> */}
    </>
  )
}
