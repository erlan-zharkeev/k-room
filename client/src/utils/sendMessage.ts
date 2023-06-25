import { Message, MessageStatus, SocketActions, SocketActionsPayload } from 'common-types'
import { ImageObject } from 'common-types'
import { socket } from 'src/socket/socket'
import { AppDispatch } from 'src/store'
import { pushTemporaryMessage } from 'src/store/roomsSlice'
import { v4 as uuidv4 } from 'uuid'

const sendMessage = ({
  authorId,
  messageText,
  roomId,
  username,
  dispatch,
  images = [],
  imageCompression = true
}: {
  authorId: string
  messageText: string
  roomId: string
  username: string
  dispatch: AppDispatch
  images?: Array<ImageObject>
  imageCompression?: boolean
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
    createdAt: String(Date.now())
  }
  const payload: SocketActionsPayload['send-message'] = {
    roomId,
    message
  }
  socket.emit(SocketActions['send-message'], payload)
  dispatch(pushTemporaryMessage({ roomId, message }))
}

export default sendMessage
