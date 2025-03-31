import { IEventSendMessage, IImageObject, IMessage, IRepliedMessage, SocketActionsType } from 'common-types'
import { socket } from 'src/shared/api'
import { AppDispatch } from 'src/app/store'
import { resetRepliedMessage, pushTemporaryMessage } from 'src/entities/chat-room'
import { generateUUIDv4 } from './generate-uuid-v4'

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
  images?: IImageObject[]
  imageCompression?: boolean
  repliedMessage?: IRepliedMessage | null
}) => {
  const message: IMessage = {
    id: '',
    tempId: generateUUIDv4(),
    status: 'sending',
    authorName: username,
    authorId,
    body: messageText,
    images,
    imageCompression,
    createdAt: String(Date.now()),
    repliedMessage
  }
  const payload: IEventSendMessage = {
    roomId,
    message
  }
  socket.emit<SocketActionsType>('send-message', payload)
  dispatch(resetRepliedMessage())
  dispatch(pushTemporaryMessage({ roomId, message }))
}
