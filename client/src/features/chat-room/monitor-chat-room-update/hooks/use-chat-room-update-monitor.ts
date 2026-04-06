import { useEffect } from 'react'

import { useChatRoomActualize, useAddRoom } from 'src/features/chat-room'

export const useChatRoomUpdateMonitor = () => {
  const { monitorChatRoomActualize } = useChatRoomActualize()
  const { monitorRoomAddition } = useAddRoom()

  useEffect(() => {
    monitorChatRoomActualize()
    monitorRoomAddition()
  }, [])
}
