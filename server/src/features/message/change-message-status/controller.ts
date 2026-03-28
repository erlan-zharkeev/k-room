import type { IEventChangeMessageStatus, SocketActionsType } from 'common'

import { changeMessageStatus } from 'src/features/message/change-message-status'

import { SocketInstanceType } from 'src/shared/config'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'change-message-status',
    async ({ messageId, status, roomId }: IEventChangeMessageStatus) => {
      const { userId } = socket.data
      await changeMessageStatus(messageId, status, userId, roomId)
    }
  )
}
