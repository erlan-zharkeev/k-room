import { SocketActionsType, IEventMessageDeleted, IEventDeleteMessage } from 'common-types'

import { socket } from 'src/shared/api'

export const useMessageDelete = () => {
  const monitorMessageDeletion = () => {
    socket.on<SocketActionsType>('message-deleted', (payload: IEventMessageDeleted) => {
      // dispatch(deleteMessage(payload))
    })
  }

  const deleteMessageHandler = (roomId: string, messageId: string) => {
    if (!roomId) return
    const payload: IEventDeleteMessage = {
      roomId,
      messageId
    }

    // dispatch(updateMessageStatus({ roomId, messageId, status: 'sending' }))
    // socket.emit<SocketActionsType>('delete-message', payload)
  }

  return {
    monitorMessageDeletion,
    deleteMessageHandler
  }
}
