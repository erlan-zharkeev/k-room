import { IMessage } from 'common'
import { useDispatch } from 'react-redux'

import { AppDispatchType } from 'src/app/store'

import { resetContextClickedObject, useSystem } from 'src/entities/system'

export const useReplyMessage = () => {
  const { repliedMessageData } = useSystem()

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
