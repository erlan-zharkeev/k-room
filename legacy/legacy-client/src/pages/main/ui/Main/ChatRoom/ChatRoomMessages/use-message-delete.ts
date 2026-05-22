import { SocketActions, EventMessageDeleted } from 'common'

import { socket } from 'src/shared/api'

export const useMessageDelete = () => {
  const monitorMessageDeletion = () => {
    socket.on<SocketActions>('message-deleted', (_payload: EventMessageDeleted) => {
      // dispatch(deleteMessage(payload))
    })
  }

  const deleteMessageHandler = (roomId: string, _messageId: string) => {
    if (!roomId) return undefined

    // dispatch(updateMessageStatus({ roomId, messageId, status: 'sending' }))
    // socket.emit<SocketActions>('delete-message', { roomId, messageId })
  }

  return {
    monitorMessageDeletion,
    deleteMessageHandler
  }
}
