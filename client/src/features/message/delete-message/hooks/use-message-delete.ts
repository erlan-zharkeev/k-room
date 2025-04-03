import { SocketActionsType, IEventMessageDeleted } from 'common-types'
import { useDispatch } from 'react-redux'
import { deleteMessage } from 'src/entities/chat-room'
import { socket } from 'src/shared/api'

export const useMessageDelete = () => {
  const dispatch = useDispatch()

  const monitorMessageDeletion = () => {
    socket.on<SocketActionsType>('message-deleted', (payload: IEventMessageDeleted) => {
      dispatch(deleteMessage(payload))
    })
  }

  return {
    monitorMessageDeletion
  }
}
