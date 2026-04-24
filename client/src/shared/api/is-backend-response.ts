import { isBoolean, isString, isUnknownObject, type IBackendResponse } from 'global-shared'

export const isBackendResponse = (data: unknown): data is IBackendResponse<unknown> => {
  if (!isUnknownObject(data)) return false

  const { message } = data

  if (!isUnknownObject(message)) return false

  const { text, silent } = message

  return isString(text) && isBoolean(silent)
}
