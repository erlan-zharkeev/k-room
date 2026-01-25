import { useEffect } from 'react'

import { useAddRoom } from '../../add-chat-room'
import { useChatRoomActualize } from '../../chat-room-actualize/hooks'

export const useChatRoomUpdateMonitor = () => {
  const { monitorChatRoomActualize } = useChatRoomActualize()
  const { monitorRoomAddition } = useAddRoom()

  useEffect(() => {
    monitorChatRoomActualize()
    monitorRoomAddition()
  }, [])
}
