import { Message, MessageStatus, RepliedMessage, SocketActions, SocketActionsPayload, ImageObject } from 'common-types'
import { $socket } from 'src/services'
import { AppDispatch, pushTemporaryMessage, resetRepliedMessage } from 'src/store'
import { v4 as uuidv4 } from 'uuid'

export const sendMessage = ({
  authorId,
  messageText,
  roomId,
  username,
  dispatch,
  images = [],
  imageCompression = true,
  repliedMessage = null
}: {
  authorId: string
  messageText: string
  roomId: string
  username: string
  dispatch: AppDispatch
  images?: Array<ImageObject>
  imageCompression?: boolean
  repliedMessage?: RepliedMessage | null
}) => {
  const message: Message = {
    id: '',
    tempId: uuidv4(),
    status: MessageStatus.sending,
    authorName: username,
    authorId,
    body: messageText,
    images,
    imageCompression,
    createdAt: String(Date.now()),
    repliedMessage
  }
  const payload: SocketActionsPayload['sendMessage'] = {
    roomId,
    message
  }
  $socket.emit(SocketActions.SEND_MESSAGE, payload)
  dispatch(resetRepliedMessage())
  dispatch(pushTemporaryMessage({ roomId, message }))
}
