import { isString, type LocalizedText, REQ_STATUS, type ReqStatus } from 'global-shared'

import { localizedText } from './localized-text'

export class AppError extends Error {
  readonly status: ReqStatus
  readonly silent: boolean
  readonly cause?: unknown
  readonly payload?: unknown
  readonly messageSource: string | LocalizedText<string>

  constructor(
    status: ReqStatus,
    messageSource: string | LocalizedText<string>,
    silent = false,
    cause?: unknown,
    payload?: unknown
  ) {
    super(isString(messageSource) ? messageSource : localizedText(messageSource))
    this.name = 'AppError'
    this.status = status
    this.silent = silent
    this.cause = cause
    this.payload = payload
    this.messageSource = messageSource
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError

export const getAppErrorMessage = (error: AppError, language?: Parameters<typeof localizedText>[1]) =>
  isString(error.messageSource) ? error.messageSource : localizedText(error.messageSource, language)

export const toAppError = (
  error: unknown,
  fallbackMessage: string | LocalizedText<string>,
  status: ReqStatus = REQ_STATUS.server,
  silent = false
) => {
  if (isAppError(error)) {
    return error
  }

  return new AppError(status, fallbackMessage, silent, error)
}
