import type { IEventChangeMessageStatus, SocketActionsType } from 'common-types'
import { SocketInstanceType } from 'shared-config'

import { changeMessageStatus } from './~shared'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('change-message-status', async ({ messageId, status, roomId }: IEventChangeMessageStatus) => {
    const { userId } = socket.data
    await changeMessageStatus(messageId, status, userId, roomId)
  })
}
