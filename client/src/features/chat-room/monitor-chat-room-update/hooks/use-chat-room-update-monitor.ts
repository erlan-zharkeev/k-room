import { useEffect } from 'react'

import { useChatRoomsLoading } from '../../load-chat-rooms'

export const useChatRoomUpdateMonitor = () => {
  const { monitorChatRoomLoading } = useChatRoomsLoading()

  useEffect(() => {
    monitorChatRoomLoading()
  }, [])
}
