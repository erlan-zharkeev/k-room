import { SocketActionsType } from 'common'

import { socket } from 'src/shared/api'

import { useHandleDeliveredMessage } from '..'

export const useMessageDelivery = () => {
  const { handleDeliveredMessage } = useHandleDeliveredMessage()

  const monitorMessageDelivered = () => {
    socket.on<SocketActionsType>('message-delivered', handleDeliveredMessage)
  }
  return { monitorMessageDelivered }
}
