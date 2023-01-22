import { useEffect } from 'react'
import ChatRoom from 'src/components/ChatRoom/ChatRoom'
import useTypedSelector from 'src/hooks/useTypedSelector'
import AsidePanel from 'src/components/AsidePanel/AsidePanel'
import TopPanel from 'src/components/TopPanel/TopPanel'
import Popup from 'src/components/Common/Popup/Popup'
import _debounce from 'lodash/debounce'
import { socket } from 'src/socket/socket'
import { SocketActions } from 'common-types'
import useSelectedRoom from 'src/hooks/useSelectedRoom'
import StubLoading from 'src/components/Common/StubLoading/StubLoading'

export const MainPage = () => {
  const selectedChatRoom = useSelectedRoom()

  const userId = useTypedSelector((state) => state.auth.userData.id)
  const { viewPort, socketConnected } = useTypedSelector((state) => state.persist.system)

  useEffect(() => {
    socket.emit(SocketActions.INITIALIZE, userId)
  }, [])

  return (
    <div className={'main-page page ' + (selectedChatRoom && viewPort.width <= 576 ? 'move-aside' : '')}>
      <StubLoading isLoading={!socketConnected} />
      <Popup />
      <TopPanel />
      <div className="main-page__content">
        <AsidePanel />
        <ChatRoom />
      </div>
    </div>
  )
}

export default MainPage
