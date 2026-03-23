import { SocketActionsType } from 'common-types'

import { useHandleDeliveredMessage } from 'src/features/message/message-delivery-handler'

import { socket } from 'src/shared/api'

export const useMessageDelivery = () => {
  const { handleDeliveredMessage } = useHandleDeliveredMessage()

  const monitorMessageDelivered = () => {
    socket.on<SocketActionsType>('message-delivered', handleDeliveredMessage)
  }
  return { monitorMessageDelivered }
}
