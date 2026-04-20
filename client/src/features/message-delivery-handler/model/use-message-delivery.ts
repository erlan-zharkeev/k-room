import { SocketActionsType } from 'common'

import { useHandleDeliveredMessage } from 'src/features/message-delivery-handler'

import { socket } from 'src/shared/api'

export const useMessageDelivery = () => {
  const { handleDeliveredMessage } = useHandleDeliveredMessage()

  const monitorMessageDelivered = () => {
    socket.on<SocketActionsType>('message-delivered', handleDeliveredMessage)
  }
  return { monitorMessageDelivered }
}
