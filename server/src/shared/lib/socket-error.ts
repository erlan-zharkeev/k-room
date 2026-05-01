import { type LocalizedTextType, REQ_STATUS, type ReqStatusType, type SocketActionsType } from 'global-shared'
import { isString } from 'lodash'

import { SHARED_I18N } from '../config/i18n'
import type { SocketInstanceType } from '../types/socket'

import { isAppError } from './app-error'
import { getIO } from './io'
import { localizedText } from './localized-text'
import { log } from './log'
import { serverCaptureSentryException, serverCaptureSentrySocketError } from './sentry'

export const throwSocketError = (
  socketId: string,
  error?: LocalizedTextType<string> | string,
  options?: {
    status?: ReqStatusType
    silent?: boolean
    cause?: unknown
  }
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

  io.to(socketId).emit<SocketActionsType>('error-message', {
    message: userMessage,
    silent,
    status
  })
}

export const socketErrorMiddleware =
  <TPayload = void>(
    socket: SocketInstanceType,
    handler: (payload: TPayload) => void | Promise<void>,
    options: {
      basicError: LocalizedTextType<string>
      status?: ReqStatusType
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

      return throwSocketError(socket.id, options.basicError, {
        status: options.status,
        silent: options.silent,
        cause: error
      })
    }
  }
