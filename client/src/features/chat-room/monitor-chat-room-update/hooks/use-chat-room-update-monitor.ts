import { useEffect } from 'react'

import { useAddRoom } from '../../add-chat-room'
import { useChatRoomsLoading } from '../../load-chat-rooms'

export const useChatRoomUpdateMonitor = () => {
  const { monitorChatRoomLoading } = useChatRoomsLoading()
  const { monitorRoomAddition } = useAddRoom()

  useEffect(() => {
    monitorChatRoomLoading()
    monitorRoomAddition()
  }, [])
}
