import { isUnknownObject } from 'global-shared'
import { isString } from 'lodash'

import type { HttpErrorType, ICreateHttpErrorPayload } from './types'

export const createHttpError = ({
  message,
  status,
  silent = false,
  payload = null
}: ICreateHttpErrorPayload): HttpErrorType =>
  Object.assign(new Error(message), {
    type: 'http-error' as const,
    status,
    silent,
    payload
  })

export const isHttpError = (error: unknown): error is HttpErrorType => {
  if (!isUnknownObject(error)) return false

  return error.type === 'http-error' && isString(error.message)
}

export const isHandledError = (error: unknown): error is HttpErrorType | Error =>
  isHttpError(error) || error instanceof Error

export const getHandledErrorMessage = (error: unknown) => (isHandledError(error) ? error.message : 'Unknown error')
