import { SocketActionsType, IEventUpdateMessageStatus } from 'common'

import { useMessage } from 'src/entities/message'

import { socket } from 'src/shared/api'

export const useMessageStatusUpdate = () => {
  const { update } = useMessage()

  const monitorMessageStatus = () => {
    socket.on<SocketActionsType>('message-status-updated', (payload: IEventUpdateMessageStatus) => {
      void update(payload.messageId, { status: payload.status })
    })
  }

  return {
    monitorMessageStatus
  }
}
