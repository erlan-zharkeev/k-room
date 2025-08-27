import './style.scss'

import { AsideBar } from 'src/widgets/aside-bar'
import { BottomBar } from 'src/widgets/bottom-bar'
import { CallStatusBar } from 'src/widgets/call-status-bar'
import { Modal } from 'src/widgets/modal'
import { TopBar } from 'src/widgets/top-bar'
import { WorkspaceLayout } from 'src/widgets/workspace-layout'

import { useCallDataUpdateMonitor } from 'src/features/call'
import { useChatRoomUpdateMonitor } from 'src/features/chat-room'
import { useContactUpdateMonitor } from 'src/features/contact'
import { useGetNotificationPermission } from 'src/features/get-notification-permission'
import { useMessageUpdateMonitor } from 'src/features/message'
import { useAudioContextMonitor } from 'src/features/monitor-audio-context'
import { useUserInteractionMonitor } from 'src/features/monitor-user-interaction'
import { useSocketConnectionMonitor } from 'src/features/socket'

import { CallModal } from 'src/entities/call'
import { useViewport } from 'src/entities/system'

export const Main = () => {
  const { greaterOrEqualTablet, lessThanTablet } = useViewport()

  useSocketConnectionMonitor()
  useContactUpdateMonitor()
  useMessageUpdateMonitor()
  useChatRoomUpdateMonitor()
  useCallDataUpdateMonitor()
  useUserInteractionMonitor()
  useAudioContextMonitor()
  useGetNotificationPermission()

  return (
    <>
      <div className="main">
        <div className="main__wrapper">
          {greaterOrEqualTablet && <AsideBar />}
          <div className="main__right-side">
            <CallStatusBar />
            <TopBar />
            <WorkspaceLayout />
            {lessThanTablet && <BottomBar />}
          </div>
        </div>
      </div>
      <Modal />
      <CallModal />
    </>
  )
}
