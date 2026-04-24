import { REQ_STATUS, type ReqStatusType } from 'global-shared'

export class AppError extends Error {
  readonly status: ReqStatusType
  readonly silent: boolean
  readonly cause?: unknown

  constructor(status: ReqStatusType, message: string, silent = false, cause?: unknown) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.silent = silent
    this.cause = cause
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError

export const toAppError = (
  error: unknown,
  fallbackMessage: string,
  status: ReqStatusType = REQ_STATUS.server,
  silent = false
) => {
  if (isAppError(error)) {
    return error
  }

  return new AppError(status, fallbackMessage, silent, error)
}
