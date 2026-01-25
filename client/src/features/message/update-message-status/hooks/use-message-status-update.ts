import { SocketActionsType, IEventUpdateMessageStatus } from 'common-types'

import { socket } from 'src/shared/api'

export const useMessageStatusUpdate = () => {
  const monitorMessageStatus = () => {
    socket.on<SocketActionsType>('message-status-updated', (payload: IEventUpdateMessageStatus) => {
      // dispatch(updateMessageStatus(payload))
    })
  }

  return {
    monitorMessageStatus
  }
}
