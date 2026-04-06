import { log } from 'console'

import { useDispatch } from 'react-redux'

import { IMessage } from 'common'

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
    log('replyMessageHandler', _message)
    // dispatch(setRepliedMessage(message))
  }

  return {
    ...repliedMessageData,
    closeReplyMessage,
    replyMessageHandler
  }
}
