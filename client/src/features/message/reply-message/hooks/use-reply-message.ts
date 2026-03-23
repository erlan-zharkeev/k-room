import { IMessage } from 'common-types'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { useChatRoom } from 'src/entities/chat-room'
import { resetContextClickedObject } from 'src/entities/system'

export const useReplyMessage = () => {
  const { repliedMessageData } = useChatRoom()

  const dispatch = useDispatch<AppDispatch>()

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
