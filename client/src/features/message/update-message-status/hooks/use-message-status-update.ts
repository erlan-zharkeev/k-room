import { SocketActionsType, IEventUpdateMessageStatus } from 'common-types'
import { useDispatch } from 'react-redux'
import { updateMessageStatus } from 'src/entities/chat-room'
import { socket } from 'src/shared/api'

export const useMessageStatusUpdate = () => {
  const dispatch = useDispatch()

  const monitorMessageStatus = () => {
    socket.on<SocketActionsType>('message-status-updated', (payload: IEventUpdateMessageStatus) => {
      dispatch(updateMessageStatus(payload))
    })
  }

  return {
    monitorMessageStatus
  }
}
