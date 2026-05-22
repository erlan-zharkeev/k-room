import { BackendResponse, ReqStatus } from 'common'

export interface DoRequestOpts<R> {
  contentType?: string
  responseType?: R
}

export type ApiError = Error & {
  type: 'api-error'
  message: string
  status?: ReqStatus
  silent: boolean
  payload: BackendResponse<unknown> | null
}

export const createApiError = ({
  message,
  status,
  silent = false,
  payload = null
}: {
  message: string
  status?: ReqStatus
  silent?: boolean
  payload?: BackendResponse<unknown> | null
}): ApiError =>
  Object.assign(new Error(message), {
    type: 'api-error' as const,
    status,
    silent,
    payload
  })

export const isApiError = (error: unknown): error is ApiError => {
  if (!error || typeof error !== 'object') return false
  const candidate = error as Record<string, unknown>
  return candidate.type === 'api-error' && typeof candidate.message === 'string'
}

export const isHandledError = (error: unknown): error is ApiError | Error => isApiError(error) || error instanceof Error
export const getHandledErrorMessage = (error: unknown) => (isHandledError(error) ? error.message : 'Unknown error')
