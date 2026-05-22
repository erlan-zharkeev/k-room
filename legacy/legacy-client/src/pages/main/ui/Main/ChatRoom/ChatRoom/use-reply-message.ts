import { log } from 'console'

import { useDispatch } from 'react-redux'

import { IMessage } from 'common'

import { AppDispatch } from 'src/shared/store'
import { useSystem, resetContextClickedObject } from 'src/shared/system'

export const useReplyMessage = () => {
  const { repliedMessageData } = useSystem()

  const dispatch = useDispatch<AppDispatch>()

  const closeReplyMessage = () => {
    dispatch(resetContextClickedObject())
    // dispatch(resetRepliedMessage())
  }

  const replyMessageHandler = (_message: IMessage) => {
    log('replyMessageHandler', _message)
    // dispatch(setRepliedMessage(message))
  }

  return {
    ...repliedMessageData,
    closeReplyMessage,
    replyMessageHandler
  }
}
