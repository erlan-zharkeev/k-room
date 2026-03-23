import type { IEventMarkCallAsVideo, SocketActionsType } from 'common-types'

import { CallModel } from 'entities/call'

import { SocketInstanceType } from 'shared-config'
import { throwSocketError } from 'shared-lib'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('mark-call-as-video', async ({ callId }: IEventMarkCallAsVideo) => {
    try {
      await CallModel.updateOne({ _id: callId }, { video: true })
    } catch {
      throwSocketError(socket.id)
    }
  })
}
