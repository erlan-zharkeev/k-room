import { EventMarkCallAsVideo, SocketActions } from 'common'

import { SocketInstance } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CallModel } from '../call.model'
import { CALL_I18N } from '../i18n'

export const markCallAsVideoController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'mark-call-as-video',
    socketErrorMiddleware(
      socket,
      async ({ callId }: EventMarkCallAsVideo) => {
        await CallModel.updateOne({ _id: callId }, { video: true })
      },
      { basicError: CALL_I18N.markCallAsVideoFailed }
    )
  )
}
