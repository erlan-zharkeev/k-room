import { isString } from 'lodash'

export const errorToMessage = (error: unknown, fallbackMessage = 'Unknown error') => {
  if (error instanceof Error) {
    return error.message
  }

  if (isString(error)) {
    return error
  }

  try {
    return JSON.stringify(error)
  } catch {
    return fallbackMessage
  }
}
