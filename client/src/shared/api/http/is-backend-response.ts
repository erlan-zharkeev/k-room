import { isUnknownObject, type BackendResponse } from 'global-shared'
import { isBoolean, isString } from 'lodash'

export const isBackendResponse = (data: unknown): data is BackendResponse<unknown> => {
  if (!isUnknownObject(data)) return false

  const { message } = data

  if (!isUnknownObject(message)) return false

  const { text, silent } = message

  return isString(text) && isBoolean(silent)
}
