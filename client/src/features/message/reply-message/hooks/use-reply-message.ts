import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { useChatRooms, resetRepliedMessage } from 'src/entities/chat-room'
import { resetContextClickedObject } from 'src/entities/system'

export const useReplyMessage = () => {
  const { repliedMessageData } = useChatRooms()
  const dispatch = useDispatch<AppDispatch>()

  const closeReplyMessage = () => {
    dispatch(resetContextClickedObject())
    dispatch(resetRepliedMessage())
  }

  return {
    ...repliedMessageData,
    closeReplyMessage
  }
}
