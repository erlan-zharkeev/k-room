import { IFrontendUserData } from 'common-types'
import { useDispatch } from 'react-redux'

// import { useChatRoomScroll } from 'src/features/chat-room'
import { setUserData as storeSetUserData } from 'src/entities/user'

import { socket } from 'src/shared/api'

export const useSetUserData = () => {
  const dispatch = useDispatch()
  // const { scrollToBottom } = useChatRoomScroll()

  const setUserData = ({ userData }: { userData: IFrontendUserData }) => {
    dispatch(storeSetUserData(userData))
    // scrollToBottom()
    socket.connect()
  }

  return { setUserData }
}
