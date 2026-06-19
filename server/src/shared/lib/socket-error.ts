import { isString, type LocalizedText, REQ_STATUS, type SocketAckFailure, type SocketAckResponse } from 'global-shared'

import { SHARED_I18N } from '../i18n'
import type { SocketErrorMiddlewareOptions, SocketInstance, ThrowSocketErrorOptions } from '../types'

import { getAppErrorMessage, isAppError } from './app-error'
import { getIO } from './io'
import { localizedText } from './localized-text'
import { log } from './log'
import { serverCaptureSentryException, serverCaptureSentrySocketError } from './sentry'

export const throwSocketError = (
  socketId: string,
  error?: LocalizedText<string> | string,
  options?: ThrowSocketErrorOptions
) => {
  const io = getIO()
  const socket = io.sockets.sockets.get(socketId)
  const isRawError = isString(error) || error === undefined
  const userMessageSource = isRawError ? SHARED_I18N.commonServerError : error
  const language = socket?.data.language
  const userMessage = localizedText(userMessageSource, language)
  const logMessage = isRawError ? error : userMessage
  const status = options?.status ?? REQ_STATUS.server
  const silent = options?.silent ?? false

  log.error(`-${logMessage}`)

  if (options?.cause) {
    serverCaptureSentryException(options.cause)
  } else {
    serverCaptureSentrySocketError({ message: logMessage, silent, status })
  }

  io.to(socketId).emit('error-message', {
    message: userMessage,
    silent,
    status
  })
}

export const socketErrorMiddleware =
  <TPayload = void>(
    socket: SocketInstance,
    handler: (payload: TPayload) => void | Promise<void>,
    options: SocketErrorMiddlewareOptions
  ) =>
  async (payload: TPayload) => {
    try {
      await handler(payload)
    } catch (error) {
      if (isAppError(error)) {
        return throwSocketError(socket.id, error.messageSource, {
          status: error.status,
          silent: error.silent,
          cause: error.cause
        })
      }

      return throwSocketError(socket.id, options.basicError, {
        status: options.status,
        silent: options.silent,
        cause: error
      })
    }
  }

const buildSocketAckFailure = <TReason extends string>(
  socket: SocketInstance,
  error: unknown
): SocketAckFailure<TReason> => {
  const response: SocketAckFailure<TReason> = {
    ok: false
  }

  if (isAppError(error) && isString(error.payload)) {
    response.reason = error.payload as TReason
    response.message = {
      text: getAppErrorMessage(error, socket.data.language),
      silent: error.silent
    }
  } else {
    response.handledByGlobalError = true
  }

  return response
}

export const socketAckMiddleware =
  <TPayload = void, TResponsePayload = void, TReason extends string = string>(
    socket: SocketInstance,
    handler: (
      payload: TPayload
    ) =>
      | void
      | SocketAckResponse<TResponsePayload, TReason>
      | Promise<void | SocketAckResponse<TResponsePayload, TReason>>,
    options: SocketErrorMiddlewareOptions
  ) =>
  async (payload: TPayload, ack?: (response: SocketAckResponse<TResponsePayload, TReason>) => void) => {
    try {
      const response = await handler(payload)

      ack?.(response ?? ({ ok: true } as SocketAckResponse<TResponsePayload, TReason>))
    } catch (error) {
      const shouldHandleByAckReason = isAppError(error) && isString(error.payload)

      if (shouldHandleByAckReason) {
        ack?.(buildSocketAckFailure<TReason>(socket, error))
        return
      }

      if (isAppError(error)) {
        throwSocketError(socket.id, error.messageSource, {
          status: error.status,
          silent: error.silent,
          cause: error.cause
        })
      } else {
        throwSocketError(socket.id, options.basicError, {
          status: options.status,
          silent: options.silent,
          cause: error
        })
      }

      ack?.(buildSocketAckFailure<TReason>(socket, error))
    }
  }
