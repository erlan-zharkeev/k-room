import { SocketActionsType, IEventUpdateMessageStatus } from 'common-types'

import { useMessage } from 'src/entities/message'

import { socket } from 'src/shared/api'

export const useMessageStatusUpdate = () => {
  const { updateMessage } = useMessage()

  const monitorMessageStatus = () => {
    socket.on<SocketActionsType>('message-status-updated', (payload: IEventUpdateMessageStatus) => {
      void updateMessage(payload.messageId, { status: payload.status })
    })
  }

  return {
    monitorMessageStatus
  }
}
