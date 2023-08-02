import { ChatRoom } from 'common-types'
import useTypedSelector from './useTypedSelector'

const useSelectedRoom = () => {
  return useTypedSelector((state) => {
    const { chatRooms } = state.chatRooms
    const { selectedChatRoomId } = state.persist.settings
    return chatRooms.find((room: ChatRoom) => room.id === selectedChatRoomId)
  })
}

export default useSelectedRoom
