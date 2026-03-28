import type { IEventChangeMessageStatus, SocketActionsType } from 'common'

import { SocketInstanceType } from 'src/shared/config'

import { changeMessageStatus } from './shared'

export const changeMessageStatusController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'change-message-status',
    async ({ messageId, status, roomId }: IEventChangeMessageStatus) => {
      const { userId } = socket.data
      await changeMessageStatus(messageId, status, userId, roomId)
    }
  )
}
