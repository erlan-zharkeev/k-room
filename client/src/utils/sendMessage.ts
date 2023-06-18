import { Message, SocketActions } from 'common-types'
import { ImageObject } from 'src/components/UI/UIFileLoader/@types'
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
  files = [],
  filesCompression = true
}: {
  authorId: string
  messageText: string
  roomId: string
  username: string
  dispatch: AppDispatch
  files?: Array<ImageObject>
  filesCompression?: boolean
}) => {
  const message: Message = {
    id: uuidv4(),
    status: 'sending',
    authorName: username,
    author: authorId,
    body: messageText,
    files,
    filesCompression,
    createdAt: String(Date.now())
  }
  socket.emit(SocketActions.SEND_MESSAGE, { roomId, message })
  dispatch(pushTemporaryMessage({ roomId, message }))
}

export default sendMessage
