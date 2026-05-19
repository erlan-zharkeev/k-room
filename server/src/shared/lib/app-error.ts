import { type LocalizedTextType, REQ_STATUS, type ReqStatusType } from 'global-shared'

import { localizedText } from './localized-text'

export class AppError extends Error {
  readonly status: ReqStatusType
  readonly silent: boolean
  readonly cause?: unknown
  readonly payload?: unknown
  readonly messageSource: string | LocalizedTextType<string>

  constructor(
    status: ReqStatusType,
    messageSource: string | LocalizedTextType<string>,
    silent = false,
    cause?: unknown,
    payload?: unknown
  ) {
    super(typeof messageSource === 'string' ? messageSource : localizedText(messageSource))
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
  typeof error.messageSource === 'string' ? error.messageSource : localizedText(error.messageSource, language)

export const toAppError = (
  error: unknown,
  fallbackMessage: string | LocalizedTextType<string>,
  status: ReqStatusType = REQ_STATUS.server,
  silent = false
) => {
  if (isAppError(error)) {
    return error
  }

  return new AppError(status, fallbackMessage, silent, error)
}
