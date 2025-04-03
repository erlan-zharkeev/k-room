import './style.scss'
import { useEffect } from 'react'

import { AsideBar } from 'src/widgets/aside-bar'
import { BottomBar } from 'src/widgets/bottom-bar'
import { CallStatusBar } from 'src/widgets/call-status-bar'
import { Content } from 'src/widgets/content'
import { GlobalLoader } from 'src/widgets/global-loader'
import { Modal } from 'src/widgets/modal'
import { TopBar } from 'src/widgets/top-bar'

import { useCallDataUpdateMonitor } from 'src/features/call'
import { useContactUpdateMonitor } from 'src/features/contact/monitor-contact-update'
import { useGetNotificationPermission } from 'src/features/get-bom-permission'
import { useMessageUpdateMonitor } from 'src/features/message'
import { useContactOnlineMonitor } from 'src/features/monitor-contacts-online'
import { useRoomUpdateMonitor } from 'src/features/room'

import { CallModal } from 'src/entities/call'
import { ContextMenuWrapper, useContextMenu } from 'src/entities/context-menu'
import { useViewport } from 'src/entities/system'

import { useSocket } from 'src/shared/api'

export const Main = () => {
  const { greaterOrEqualTablet, lessThanTablet } = useViewport()
  const { reset: resetContextMenu } = useContextMenu()
  const { getNotificationPermission } = useGetNotificationPermission()
  const { initSocketConnection } = useSocket()

  initSocketConnection()
  useContactOnlineMonitor()
  useContactUpdateMonitor()
  useMessageUpdateMonitor()
  useRoomUpdateMonitor()
  useCallDataUpdateMonitor()

  useEffect(() => {
    getNotificationPermission()
  }, [])

  return (
    <>
      <div className="main" onClick={resetContextMenu}>
        <div className="main__wrapper">
          {greaterOrEqualTablet && <AsideBar />}
          <div className="main__right-side">
            <CallStatusBar />
            <TopBar />
            <Content />
            {lessThanTablet && <BottomBar />}
          </div>
        </div>
      </div>
      <GlobalLoader />
      <Modal />
      <CallModal />
      <ContextMenuWrapper />
    </>
  )
}
