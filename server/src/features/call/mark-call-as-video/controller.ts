import { IEventMarkCallAsVideo, SocketActionsType } from 'common'

import { CallModel } from 'src/entities/call'

import { SocketInstanceType } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CALL_I18N } from './../config'

export const markCallAsVideoController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'mark-call-as-video',
    socketErrorMiddleware(
      socket,
      async ({ callId }: IEventMarkCallAsVideo) => {
        await CallModel.updateOne({ _id: callId }, { video: true })
      },
      { basicError: CALL_I18N.markCallAsVideoFailed }
    )
  )
}
