import { IBackendResponse, StatusEnum } from 'common-types'

export interface IDoRequestOpts<R> {
  contentType?: string
  responseType?: R
}

export class ApiError extends Error {
  status?: StatusEnum
  silent: boolean
  payload: IBackendResponse<unknown> | null

  constructor({
    message,
    status,
    silent = false,
    payload = null
  }: {
    message: string
    status?: StatusEnum
    silent?: boolean
    payload?: IBackendResponse<unknown> | null
  }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.silent = silent
    this.payload = payload
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError
