import { ChatRoom } from 'common-types'
import useTypedSelector from './useTypedSelector'

export const useSelectedRoom = () => {
  return useTypedSelector((state) => {
    const { chatRooms } = state.chatRooms
    const { selectedChatRoomId } = state.persist.system
    return chatRooms.find((room: ChatRoom) => room.roomId === selectedChatRoomId)
  })
}

export default useSelectedRoom
