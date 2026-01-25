import { SocketActionsType, IEventUpdatedMessageReactions } from 'common-types'

import { socket } from 'src/shared/api'

export const useMessageReactionUpdate = () => {
  const monitorMessageReactionUpdate = () => {
    socket.on<SocketActionsType>('message-reaction-updated', (payload: IEventUpdatedMessageReactions) => {
      // dispatch(updateMessageReactions(payload))
    })
  }

  return {
    monitorMessageReactionUpdate
  }
}
