import { log } from 'console'

import { SocketActionsType, IEventUpdatedMessageReactions } from 'common'

import { socket } from 'src/shared/api'

export const useMessageReactionUpdate = () => {
  const monitorMessageReactionUpdate = () => {
    socket.on<SocketActionsType>('message-reaction-updated', (_payload: IEventUpdatedMessageReactions) => {
      log('message-reaction-updated', _payload)
      // dispatch(updateMessageReactions(payload))
    })
  }

  return {
    monitorMessageReactionUpdate
  }
}
