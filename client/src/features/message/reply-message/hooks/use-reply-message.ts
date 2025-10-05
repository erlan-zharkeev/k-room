import { IMessage } from 'common-types'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { useChatRoom, resetRepliedMessage, setRepliedMessage } from 'src/entities/chat-room'
import { resetContextClickedObject } from 'src/entities/system'

export const useReplyMessage = () => {
  const { repliedMessageData } = useChatRoom()

  const dispatch = useDispatch<AppDispatch>()

  const closeReplyMessage = () => {
    dispatch(resetContextClickedObject())
    dispatch(resetRepliedMessage())
  }

  const replyMessageHandler = (message: IMessage) => {
    dispatch(setRepliedMessage(message))
  }

  return {
    ...repliedMessageData,
    closeReplyMessage,
    replyMessageHandler
  }
}
