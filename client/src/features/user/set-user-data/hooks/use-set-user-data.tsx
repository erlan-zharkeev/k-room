import { IUserData } from 'common-types'
import { useDispatch } from 'react-redux'

// import { useChatRoomScroll } from 'src/features/chat-room'
import { setUserData as storeSetUserData } from 'src/entities/user'

import { socket } from 'src/shared/api'

export const useSetUserData = () => {
  const dispatch = useDispatch()
  // const { scrollToBottom } = useChatRoomScroll()

  const setUserData = ({ userData }: { userData: IUserData }) => {
    dispatch(storeSetUserData(userData))
    // scrollToBottom()
    socket.connect()
  }

  return { setUserData }
}
