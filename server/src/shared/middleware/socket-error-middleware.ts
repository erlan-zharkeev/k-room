import { LocalizedTextType, StatusEnum } from 'common'

import { SHARED_I18N, SocketInstanceType } from 'src/shared/config'

import { isAppError, throwSocketError } from './../lib'

export const socketErrorMiddleware =
  <TPayload = void>(
    socket: SocketInstanceType,
    handler: (payload: TPayload) => void | Promise<void>,
    options: {
      basicError: LocalizedTextType<string>
      status?: StatusEnum
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
