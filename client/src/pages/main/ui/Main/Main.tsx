import './style.scss'

import { ReactElement } from 'react'

import { AsideBar } from 'src/widgets/aside-bar'
import { AsidePanel } from 'src/widgets/aside-panel'
import { BottomBar } from 'src/widgets/bottom-bar'
// import { CallStatusBar } from 'src/widgets/call-status-bar'
import { ChatRoom } from 'src/widgets/chat-room'
import { ConnectionStatusInfo } from 'src/widgets/connection-status-info'
import { Content } from 'src/widgets/content'
import { InfoNotification } from 'src/widgets/info-notifications'
import { TopBar } from 'src/widgets/top-bar'
import { WorkspaceLayout } from 'src/widgets/workspace-layout'

// import { useCallDataUpdateMonitor } from 'src/features/call'
import { useGetNotificationPermission } from 'src/features/get-notification-permission'
import { useLoadRoomMessages } from 'src/features/load-room-messages'
import { useAudioContextMonitor } from 'src/features/monitor-audio-context'
import { useChatRoomUpdateMonitor } from 'src/features/monitor-chat-room-update'
import { useContactUpdateMonitor } from 'src/features/monitor-contact-update'
import { useInfoNotificationUpdateMonitor } from 'src/features/monitor-info-notification-update'
import { useMessageUpdateMonitor } from 'src/features/monitor-message-update'
import { useUserInteractionMonitor } from 'src/features/monitor-user-interaction'
import { useSocketConnectionMonitor } from 'src/features/socket'

// import { CallModal } from 'src/entities/call'
import { ContentTabType } from 'src/shared/config'
import { useSettings } from 'src/shared/preferences'
import { useViewport } from 'src/shared/system'

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
  useAudioContextMonitor()
  useGetNotificationPermission()

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
