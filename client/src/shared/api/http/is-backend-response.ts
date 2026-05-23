import { isBoolean, isString, isUnknownObject, type BackendResponse } from 'global-shared'

export const isBackendResponse = (data: unknown): data is BackendResponse<unknown> => {
  if (!isUnknownObject(data)) return false

  const { message } = data

  if (!isUnknownObject(message)) return false

  const { text, silent } = message

  return isString(text) && isBoolean(silent)
}
