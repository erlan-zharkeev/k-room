import { SocketActionsType, IEventMessageDeleted, IEventDeleteMessage } from 'common-types'
import { useDispatch } from 'react-redux'

import { deleteMessage, updateMessageStatus } from 'src/entities/chat-room'

import { socket } from 'src/shared/api'

export const useMessageDelete = () => {
  const dispatch = useDispatch()

  const monitorMessageDeletion = () => {
    socket.on<SocketActionsType>('message-deleted', (payload: IEventMessageDeleted) => {
      dispatch(deleteMessage(payload))
    })
  }

  const deleteMessageHandler = (roomId: string, messageId: string) => {
    if (!roomId) return
    const payload: IEventDeleteMessage = {
      roomId,
      messageId
    }

    dispatch(updateMessageStatus({ roomId, messageId, status: 'sending' }))
    socket.emit<SocketActionsType>('delete-message', payload)
  }

  return {
    monitorMessageDeletion,
    deleteMessageHandler
  }
}
