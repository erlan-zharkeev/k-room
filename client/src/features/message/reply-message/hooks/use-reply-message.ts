import { IMessage } from 'common'
import { useDispatch } from 'react-redux'

import { AppDispatchType } from 'src/app/store'

import { useChatRoom } from 'src/entities/chat-room'
import { resetContextClickedObject } from 'src/entities/system'

export const useReplyMessage = () => {
  const { repliedMessageData } = useChatRoom()

  const dispatch = useDispatch<AppDispatchType>()

  const closeReplyMessage = () => {
    dispatch(resetContextClickedObject())
    // dispatch(resetRepliedMessage())
  }

  const replyMessageHandler = (_message: IMessage) => {
    // dispatch(setRepliedMessage(message))
  }

  return {
    ...repliedMessageData,
    closeReplyMessage,
    replyMessageHandler
  }
}
