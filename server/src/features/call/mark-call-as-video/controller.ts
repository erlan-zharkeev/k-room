import { IEventMarkCallAsVideo, SocketActionsType } from 'common'

import { CallModel } from 'src/entities/call'

import { SocketInstanceType } from 'src/shared/config'
import { throwSocketError } from 'src/shared/lib'

export const markCallAsVideoController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('mark-call-as-video', async ({ callId }: IEventMarkCallAsVideo) => {
    try {
      await CallModel.updateOne({ _id: callId }, { video: true })
    } catch {
      throwSocketError(socket.id)
    }
  })
}
