import { ReqStatus } from 'common'

export class AppError extends Error {
  readonly status: ReqStatus
  readonly silent: boolean
  readonly cause?: unknown

  constructor(status: ReqStatus, message: string, silent: boolean = false, cause?: unknown) {
    super(message)

    this.name = 'AppError'
    this.status = status
    this.silent = silent
    this.cause = cause
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError
