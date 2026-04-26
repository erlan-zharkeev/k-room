import { isString, isUnknownObject } from 'global-shared'

import type { ApiErrorType, ICreateApiErrorPayload } from './types'

export const createApiError = ({
  message,
  status,
  silent = false,
  payload = null
}: ICreateApiErrorPayload): ApiErrorType =>
  Object.assign(new Error(message), {
    type: 'api-error' as const,
    status,
    silent,
    payload
  })

export const isApiError = (error: unknown): error is ApiErrorType => {
  if (!isUnknownObject(error)) return false

  return error.type === 'api-error' && isString(error.message)
}

export const isHandledError = (error: unknown): error is ApiErrorType | Error =>
  isApiError(error) || error instanceof Error

export const getHandledErrorMessage = (error: unknown) => (isHandledError(error) ? error.message : 'Unknown error')
