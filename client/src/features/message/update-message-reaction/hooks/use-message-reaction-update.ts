import { SocketActionsType, IEventUpdatedMessageReactions } from 'common-types'
import { useDispatch } from 'react-redux'
import { updateMessageReactions } from 'src/entities/chat-room'
import { socket } from 'src/shared/api'

export const useMessageReactionUpdate = () => {
  const dispatch = useDispatch()

  const monitorMessageReactionUpdate = () => {
    socket.on<SocketActionsType>('message-reaction-updated', (payload: IEventUpdatedMessageReactions) => {
      dispatch(updateMessageReactions(payload))
    })
  }

  return {
    monitorMessageReactionUpdate
  }
}
