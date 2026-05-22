import { LocalizedText, ReqStatus } from 'common'

import { SHARED_I18N, SocketInstance } from 'src/shared/config'

import { isAppError } from '../lib/app-error'
import { throwSocketError } from '../lib/throw-error'

export const socketErrorMiddleware =
  <TPayload = void>(
    socket: SocketInstance,
    handler: (payload: TPayload) => void | Promise<void>,
    options: {
      basicError: LocalizedText<string>
      status?: ReqStatus
      silent?: boolean
    }
  ) =>
  async (payload: TPayload) => {
    try {
      await handler(payload)
    } catch (error) {
      if (isAppError(error)) {
        return throwSocketError(socket.id, error.message, {
          status: error.status,
          silent: error.silent,
          cause: error.cause
        })
      }

      throwSocketError(socket.id, options.basicError ?? SHARED_I18N.commonServerError, {
        status: options.status,
        silent: options.silent,
        cause: error
      })
    }
  }
