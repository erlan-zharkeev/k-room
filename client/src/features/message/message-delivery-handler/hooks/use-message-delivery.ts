import { SocketActionsType } from 'common-types'

import { socket } from 'src/shared/api'

import { usePushMessage } from '../../push-message/hooks'

export const useMessageDelivery = () => {
  const { pushMessage } = usePushMessage()

  const monitorMessageDelivered = () => {
    socket.on<SocketActionsType>('message-delivered', pushMessage)
  }
  return { monitorMessageDelivered }
}
