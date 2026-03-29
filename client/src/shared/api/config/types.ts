import { IBackendResponse, StatusEnum } from 'common'

export interface IDoRequestOpts<R> {
  contentType?: string
  responseType?: R
}

export type ApiErrorType = Error & {
  type: 'api-error'
  message: string
  status?: StatusEnum
  silent: boolean
  payload: IBackendResponse<unknown> | null
}

export const createApiError = ({
  message,
  status,
  silent = false,
  payload = null
}: {
  message: string
  status?: StatusEnum
  silent?: boolean
  payload?: IBackendResponse<unknown> | null
}): ApiErrorType =>
  Object.assign(new Error(message), {
    type: 'api-error' as const,
    status,
    silent,
    payload
  })

export const isApiError = (error: unknown): error is ApiErrorType => {
  if (!error || typeof error !== 'object') return false
  const candidate = error as Record<string, unknown>
  return candidate.type === 'api-error' && typeof candidate.message === 'string'
}

export const isHandledError = (error: unknown): error is ApiErrorType | Error =>
  isApiError(error) || error instanceof Error
export const getHandledErrorMessage = (error: unknown) => (isHandledError(error) ? error.message : 'Unknown error')
