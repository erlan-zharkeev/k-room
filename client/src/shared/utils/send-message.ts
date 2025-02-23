import { EventSendMessage, ImageObject, Message, RepliedMessage, SocketActions } from 'common-types'
import { socket } from 'src/shared/api'
import { AppDispatch } from 'src/app/store'
import { v4 as uuidv4 } from 'uuid'
import { resetRepliedMessage, pushTemporaryMessage } from 'src/entities/chat-room'

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
    status: 'sending',
    authorName: username,
    authorId,
    body: messageText,
    images,
    imageCompression,
    createdAt: String(Date.now()),
    repliedMessage
  }
  const payload: EventSendMessage = {
    roomId,
    message
  }
  socket.emit<SocketActions>('send-message', payload)
  dispatch(resetRepliedMessage())
  dispatch(pushTemporaryMessage({ roomId, message }))
}
