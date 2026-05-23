import { isString, isUnknownObject } from 'global-shared'

import type { HttpError, CreateHttpErrorPayload } from './types'

export const createHttpError = ({
  message,
  status,
  silent = false,
  payload = null
}: CreateHttpErrorPayload): HttpError =>
  Object.assign(new Error(message), {
    type: 'http-error' as const,
    status,
    silent,
    payload
  })

export const isHttpError = (error: unknown): error is HttpError => {
  if (!isUnknownObject(error)) return false

  return error.type === 'http-error' && isString(error.message)
}

export const isHandledError = (error: unknown): error is HttpError | Error =>
  isHttpError(error) || error instanceof Error

export const getHandledErrorMessage = (error: unknown) => (isHandledError(error) ? error.message : 'Unknown error')
