import { useEffect } from 'react'

import { useAddRoom } from 'src/features/chat-room/add-chat-room'
import { useChatRoomActualize } from 'src/features/chat-room/chat-room-actualize/hooks'

export const useChatRoomUpdateMonitor = () => {
  const { monitorChatRoomActualize } = useChatRoomActualize()
  const { monitorRoomAddition } = useAddRoom()

  useEffect(() => {
    monitorChatRoomActualize()
    monitorRoomAddition()
  }, [])
}
